import { HTTP_NO_CONTENT } from "../constants/http.constants.js";
import asyncHandler from "../middleware/async-handler.js";
import RefreshTokenService from "../services/token.service.js";

class TokenController {
  constructor() {
    this.tokenService = new RefreshTokenService();
  }

  deleteToken = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await this.tokenService.deleteToken(id);
    res.status(HTTP_NO_CONTENT).send();
  });
}

export default TokenController;
