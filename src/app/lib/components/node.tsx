import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Node({
  title,
  src,
  type,
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
      className={`flex flex-col items-center justify-center w-20 h-20 bg-gray-100 border border-gray-300 rounded-lg ${className}`}
      onDragStart={onDragStart}
      draggable
    >
      <div className="text-center text-gray-700 text-[10px]">{title}</div>
      <Button
        size="icon"
        variant={
          type as
            | "link"
            | "default"
            | "destructive"
            | "outline"
            | "secondary"
            | "ghost"
            | undefined
        }
      >
        <Image src={src} alt="" width={24} height={24} />
      </Button>
    </div>
  );
}
