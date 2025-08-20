import { ApiResponse } from "../utils/api-response.js";

const healthcheck = async (req, res) => {
  try {
    res.status(200).json(
      new ApiResponse(200, {
        message: "Server is running",
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(500, null, "Internal Server Error", [error.message]),
      );
  }
};

export { healthcheck };
