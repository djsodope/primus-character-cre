import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { User, SignOut } from '@phosphor-icons/react';
import { toast } from 'sonner';

export const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Card className="max-w-sm mx-auto parchment-bg fantasy-border">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-accent" weight="fill" />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm text-foreground">
              {currentUser.email}
            </p>
            <p className="text-xs text-muted-foreground">
              Adventurer
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive"
        >
          <SignOut className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};