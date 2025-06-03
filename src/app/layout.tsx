import '@/app/global.css';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Toaster visibleToasts={1} closeButton={true} toastOptions={{ closeButton: true }} />
      </body>
    </html>
  );
}
