import Ping from "@/components/Ping";
const View = ({ totalViews }: { totalViews: number }) => {
  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        Views: {totalViews}
      </p>
    </div>
  );
};

export default View;
