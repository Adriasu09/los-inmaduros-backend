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

    // Create a session for the user
    const session = await clerkClient.sessions.createSession({
      userId: user.id,
    });

    // Get the JWT token from the session using your custom template
    const tokenResponse = await clerkClient.sessions.getToken(
      session.id,
      "testing-template",
    );

    // Extract the JWT string from the response
    const token =
      typeof tokenResponse === "string" ? tokenResponse : tokenResponse.jwt;

    res.json({
      success: true,
      message: "Test token generated successfully",
      data: {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        sessionId: session.id,
        token: token, // ← Solo el JWT string
        warning: "This endpoint should be removed in production",
        instructions:
          "Copy this token and use it in Postman: Authorization: Bearer <token>",
      },
    });
  } catch (error: any) {
    console.error("Error generating test token:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate test token",
      details: error.errors || [],
    });
  }
});

export default router;
