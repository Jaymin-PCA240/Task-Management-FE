import { Card, CardContent, Typography } from '@mui/material';
import { Logo } from './Logo';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200">
        <CardContent>
          <Logo />
          <Typography variant="h5" className="text-center font-semibold mb-2 text-gray-800">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" className="text-center text-gray-500 mb-6" style={{marginBottom:"20px"}}>
              {subtitle}
            </Typography>
          )}
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
