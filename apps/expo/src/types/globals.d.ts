export {};

declare global {
  interface UserPublicMetadata {
    onBoardingCompleted: boolean;
    institutionName?: string;
    course?: string;
    year?: string;
  }
}
