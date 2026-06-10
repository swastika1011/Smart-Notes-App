import Ping from "@/components/Ping";
import { getNoteById } from "@/lib/mock-data";

const View = async ({ id }: { id: string }) => {
  const totalViews = getNoteById(id)?.views ?? 0;

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-white">Views: {totalViews}</span>
      </p>
    </div>
  );
};

export default View;
