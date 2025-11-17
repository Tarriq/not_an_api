import type { Request, Response } from "express";
import prisma from "../prisma/client.js";
import type { Story, Filters, RawStory } from "../types/index.js";
import {
  STORY_INCLUDE,
  deleteStoryCategories,
  processCategories,
  processStories,
  processStory,
} from "../helpers/story.helpers.js";

// GET /stories?search=&boroughs=&categories=
export const getStories = async (req: Request, res: Response) => {
  try {
    const filters: Filters = {
      search: (req.query.search as string) || "",
      boroughs: req.query.boroughs
        ? (req.query.boroughs as string).split(",")
        : [],
      categories: req.query.categories
        ? (req.query.categories as string).split(",")
        : [],
    };

    const storiesRaw: RawStory[] = await prisma.story.findMany({
      where: {
        isPublished: true,
        ...(filters.search ? { title: { contains: filters.search } } : {}),
        ...(filters.boroughs.length
          ? { borough: { in: filters.boroughs } }
          : {}),
        ...(filters.categories.length
          ? { categories: { some: { categoryId: { in: filters.categories } } } }
          : {}),
      },
      include: STORY_INCLUDE,
    });

    const stories: Story[] = processStories(storiesRaw);

    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};

// GET /stories/hidden
export const getHiddenStories = async (req: Request, res: Response) => {
  try {
    const storiesRaw: RawStory[] = await prisma.story.findMany({
      where: { isPublished: false },
      include: STORY_INCLUDE,
    });

    const stories: Story[] = processStories(storiesRaw);

    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch hidden stories" });
  }
};

// GET /stories/:id
export const getStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Story ID is required" });
    }

    const storyRaw: RawStory | null = await prisma.story.findUnique({
      where: { id },
      include: STORY_INCLUDE,
    });

    if (!storyRaw || !storyRaw.isPublished) {
      return res
        .status(404)
        .json({ error: "Story not found or not published" });
    }

    const story: Story = processStory(storyRaw);
    res.json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch story" });
  }
};

// POST /stories
export const createStory = async (req: Request, res: Response) => {
  try {
    const { title, content, borough, summary, categoryIds, thumbnailUrl } =
      req.body;

    if (!title || !content || !borough || !summary || !thumbnailUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Replace this with actual user ID logic later
    const authorId = req.body.authorId || "demo-user-id";

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

    // Attach categories (if any)
    if (categoryIds?.length) {
      await processCategories(newStory.id, categoryIds);
    }

    res.status(201).json(newStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create story" });
  }
};

// PUT /stories/:id
export const editStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, borough, summary, categoryIds, thumbnailUrl } =
      req.body;

    if (!id || !title || !content || !borough || !summary) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updateData: {
      title: string;
      content: string;
      borough: string;
      summary: string;
      thumbnail?: string;
    } = {
      title,
      content,
      borough,
      summary,
    };

    // Only update thumbnail if a new URL is provided
    if (thumbnailUrl) {
      updateData.thumbnail = thumbnailUrl;
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: updateData,
    });

    // Update categories if provided
    if (categoryIds?.length) {
      await processCategories(id, categoryIds);
    }

    res.json(updatedStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to edit story" });
  }
};

// PATCH /stories/:id/unpublish
export const unpublishStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Story ID is required" });
    }

    const story = await prisma.story.findUnique({ where: { id } });

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    if (story.isRadar) {
      return res.status(400).json({ error: "Cannot unpublish a radar story" });
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: { isPublished: false },
    });

    res.json(updatedStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unpublish story" });
  }
};

// PATCH /stories/:id/unpublish
export const republishStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Story ID is required" });
    }

    const story = await prisma.story.findUnique({ where: { id } });

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: { isPublished: true },
    });

    res.json(updatedStory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to republish story" });
  }
};

// DELETE /stories/:id
export const deleteStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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

    // Remove category links
    await deleteStoryCategories(id);

    // Delete the story
    await prisma.story.delete({ where: { id } });

    res.json({ message: "Story deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete story" });
  }
};

// GET /stories/radar
export const getRadarStory = async (_req: Request, res: Response) => {
  try {
    let story = await prisma.story.findFirst({
      where: { isPublished: true, isRadar: true },
      include: STORY_INCLUDE,
    });

    if (!story) {
      const recommended = await prisma.story.findFirst({
        where: { isPublished: true, isRecommended: true },
        include: STORY_INCLUDE,
      });
      if (recommended) {
        await prisma.story.update({
          where: { id: recommended.id },
          data: { isRadar: true },
        });
        story = recommended;
      }
    }

    if (!story) {
      const fallback = await prisma.story.findFirst({
        where: { isPublished: true, isRecommended: false },
        include: STORY_INCLUDE,
      });
      if (fallback) {
        await prisma.story.update({
          where: { id: fallback.id },
          data: { isRadar: true },
        });
        story = fallback;
      }
    }

    if (!story)
      return res.status(404).json({ error: "No story available for radar" });

    const processed = processStory(story as RawStory);
    res.json(processed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch radar story" });
  }
};

// PATCH /stories/radar/:id
export const updateRadarStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Story ID is required" });
    }

    const existing = await prisma.story.findUnique({ where: { id } });
    if (!existing || !existing.isPublished) {
      return res
        .status(404)
        .json({ error: "Story not found or not published" });
    }

    await prisma.story.updateMany({
      where: { isRadar: true },
      data: { isRadar: false },
    });

    await prisma.story.update({
      where: { id },
      data: { isRadar: true },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update radar story" });
  }
};

// GET /stories/recommended
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const recommendedStories = await prisma.story.findMany({
      where: { isRecommended: true },
      include: STORY_INCLUDE,
      take: 4,
    });

    const stories = processStories(recommendedStories);
    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recommended stories' });
  }
};

// POST /stories/recommended
export const addRecommendation = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    const updated = await prisma.story.update({
      where: { id },
      data: { isRecommended: true },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add recommendation' });
  }
};

// DELETE /stories/recommended
export const removeRecommendation = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    const updated = await prisma.story.update({
      where: { id },
      data: { isRecommended: false },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove recommendation' });
  }
};

