import AddVideoButton from "./add-video-button";
import SearchVideo from "./search-video";
import { Videos } from "./videos";

export default async function Page() {
  return (
    <div>
      <div className="flex gap-3">
        <SearchVideo />
        <AddVideoButton />
      </div>

      <Videos />
    </div>
  );
}
