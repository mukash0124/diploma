import Image from "next/image";

export default function Node({
  title,
  src,
  onDragStart,
  className,
}: {
  title: string;
  src: string;
  type?: string;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  className?: string;
}) {
  return (
    <div
      className={`w-16 h-16 p-1.5 flex flex-col items-center justify-center gap-y-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden ${className}`}
      onDragStart={onDragStart}
      draggable
    >
      <div className="text-[7px] font-medium text-center leading-none">
        {title}
      </div>

      <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
        <Image src={src} alt={title} fill className="object-cover" />
      </div>
    </div>
  );
}
