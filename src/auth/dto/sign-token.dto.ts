export class SignTokenDto {
  id: string;
  secretAccess: string;
  secretRefresh: string;
  refreshToken?: string;
}
