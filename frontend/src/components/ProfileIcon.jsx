import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function ProfileIcon({ imageURL = "https://github.com/shadcn.png" }) {
  return (
    <Avatar>
      <AvatarImage src={imageURL} alt="user image" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
