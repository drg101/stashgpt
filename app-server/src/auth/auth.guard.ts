import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { getAuth } from "firebase-admin/auth";

/** Right now firebase auth only */
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.auth;
    if (!authHeader) {
      throw new UnauthorizedException("Auth header is required");
    }
    const auth = getAuth();
    const user = await auth.verifyIdToken(authHeader);
    // sus but fun
    request.uid = user.uid;

    return true;
  }
}
