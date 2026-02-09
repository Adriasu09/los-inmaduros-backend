import { Router, Request, Response } from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";

const router = Router();

/**
 * @route   POST /api/auth/test-token
 * @desc    Get a test token for a user (DEVELOPMENT ONLY)
 * @access  Public (should be removed in production)
 */
router.post("/test-token", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Find user by email
    const users = await clerkClient.users.getUserList({
      emailAddress: [email],
    });

    if (!users || users.data.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found. Create user in Clerk dashboard first.",
      });
    }

    const user = users.data[0];

    // Create a session token for testing
    // Note: In production, tokens should only come from the frontend
    const token = await clerkClient.sessions.createSession({
      userId: user.id,
    });

    res.json({
      success: true,
      message: "Test token generated successfully",
      data: {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        token: token.id,
        warning: "This endpoint should be removed in production",
      },
    });
  } catch (error: any) {
    console.error("Error generating test token:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate test token",
    });
  }
});

export default router;
