import type { Request, Response } from "express";
import {
  deleteStoryCategories,
  fetchStories,
  flattenCategories,
  processCategories,
  STORY_RELATIONS,
} from "../../helpers/story.helpers.js";
import { prisma } from "../../prisma/prisma.js";

export const getStories = async (req: Request, res: Response) => {
  try {
    const { search, boroughs, categories } = req.query;

    const queryFilter: any = {
      isPublished: true,
    };

    if (typeof search === "string" && search) {
      queryFilter.title = { contains: search };
    }

    if (typeof boroughs === "string" && boroughs.length > 0) {
      queryFilter.borough = { in: boroughs.split(",") };
    }

    if (typeof categories === "string" && categories.length > 0) {
      queryFilter.categories = {
        some: { categoryId: { in: categories.split(",") } },
      };
    }

    const stories = await fetchStories({
      where: queryFilter,
      omit: { content: true },
    });

    res.json(stories);
  } catch (err) {
    console.error("Error in getStories:", err);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};

export const getHiddenStories = async (req: Request, res: Response) => {  
  try {
    const stories = await fetchStories({
      where: { isPublished: false },
    });

    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch hidden stories" });
  }
};

export const getStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!id) return res.status(400).json({ error: "MISSING_STORY_ID" });

    const story = await prisma.story.findUnique({
      where: { id: id as string},
      include: {
        ...STORY_RELATIONS.include,
        save: userId ? { where: { userId: String(userId) } } : false,
      },
    });

    if (!story || !story.isPublished) {
      return res.status(404).json({ error: "NOT_fOUND_OR_NOT_PUBLISHED" });
    }

    const flatStory = flattenCategories(story);

    const responseData = {
      ...flatStory,
      isSaved: Array.isArray(story.save) && story.save.length > 0,
    };

    delete (responseData as any).save;

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch story" });
  }
};

export const createStory = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      borough,
      summary,
      categoryIds,
      thumbnailUrl,
      authorId,
    } = req.body;

    if (
      !title ||
      !content ||
      !borough ||
      !summary ||
      !authorId ||
      !thumbnailUrl
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newStory = await prisma.story.create({
      data: {
        title,
        content,
        borough,
        summary,
        thumbnail: thumbnailUrl,
        isPublished: true,
        author: { connect: { id: authorId } },
      },
    });

    if (categoryIds?.length) {
      await processCategories(newStory.id, categoryIds);
    }

    res.status(201).json(newStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create story" });
  }
};

export const editStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, borough, summary, categoryIds, thumbnailUrl } =
      req.body;

    if (!id) return res.status(400).json({ error: "Story ID is required" });

    await prisma.story.update({
      where: { id: id as string },
      data: {
        title,
        content,
        borough,
        summary,
        thumbnail: thumbnailUrl,
      },
    });

    if (categoryIds) {
      await processCategories(id as string, categoryIds);
    }

    res.status(200).send();
  } catch (err: any) {
    if (err.code === "P2025")
      return res.status(404).json({ error: "Story not found" });
    console.error("Edit Story Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const unpublishStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Story ID is required" });
    }

    const updatedStory = await prisma.story.update({
      where: { id: id as string, isRadar: false },
      data: { isPublished: false },
    });

    res.json(updatedStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unpublish story" });
  }
};

export const republishStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Story ID is required" });
    }

    const updatedStory = await prisma.story.update({
      where: { id: id as string },
      data: { isPublished: true },
    });

    res.json(updatedStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to republish story" });
  }
};

export const deleteStory = async (req: Request, res: Response) => {
  try {
    const { id } = Array.isArray(req.params) ? req.params[0] : req.params;

    if (!id) {
      return res.status(400).json({ error: "Story ID is required" });
    }

    const story = await prisma.story.findUnique({ where: { id } });

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    if (story.isRadar || story.isPublished || story.isRecommended) {
      return res.status(400).json({
        error: "Cannot delete published, radar, or recommended story",
      });
    }

    await deleteStoryCategories(id);

    await prisma.story.delete({ where: { id } });

    res.json({ message: "Story deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete story" });
  }
};