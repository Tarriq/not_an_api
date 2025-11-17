import type { Request, Response } from "express";
import prisma from "../prisma/client.js";
import { STORY_INCLUDE, processStories } from "../helpers/story.helpers.js";

// POST /save
export const createStorySave = async (req: Request, res: Response) => {
  try {
    const { storyId, userId } = req.body;

    if (!storyId || !userId) {
      return res.status(400).json({ error: 'storyId and userId are required' });
    }

    const save = await prisma.save.create({
      data: { storyId, userId },
    });

    res.json(save);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save story' });
  }
};

// GET /save/user/:userId/story/:storyId
export const isStorySaved = async (req: Request, res: Response) => {
  try {
    const { storyId, userId } = req.params;

    if (!storyId || !userId) {
      return res.status(400).json({ error: 'storyId and userId are required' });
    }

    const save = await prisma.save.findFirst({
      where: { storyId: storyId as string, userId: userId as string },
    });

    res.json({ saved: !!save });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check saved story' });
  }
};

// GET /save/:userId
export const getSavedStories = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const saves = await prisma.save.findMany({
      where: { userId: userId as string },
      select: { storyId: true },
    });

    const savedStoryIds = saves.map((save) => save.storyId);

    const stories = await prisma.story.findMany({
      where: { id: { in: savedStoryIds } },
      include: STORY_INCLUDE,
    });

    res.json(processStories(stories));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch saved stories' });
  }
};

// DELETE /save
export const deleteStorySave = async (req: Request, res: Response) => {
  try {
    const { storyId, userId } = req.body;

    if (!storyId || !userId) {
      return res.status(400).json({ error: 'storyId and userId are required' });
    }

    await prisma.save.deleteMany({
      where: { storyId: storyId as string, userId: userId as string },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unsave story' });
  }
};