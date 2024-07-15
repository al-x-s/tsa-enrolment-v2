import { QueryClient } from "@tanstack/react-query";
import { getAccessory } from "@/lib/server_actions/back_end/dbQueries_ACCESSORY";

export default async function AccessoryDetailsLayout({ children }: any) {
  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-7xl gap-2">
        <h1 className="text-3xl font-semibold">Create Accessory</h1>
      </div>
      <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_500px]">
        {children}
      </div>
    </div>
  );
}
