import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { SignIn, Eye, EyeSlash } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface LoginFormProps {
  onShowRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Welcome back, adventurer!');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Failed to sign in';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Try again later';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto parchment-bg fantasy-border">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
          <SignIn className="w-8 h-8 text-accent" weight="fill" />
        </div>
        <CardTitle className="font-serif text-2xl text-primary">
          Welcome Back
        </CardTitle>
        <p className="text-muted-foreground">
          Sign in to access your character collection
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="fantasy-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="fantasy-border pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlash className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full glow-hover" 
            disabled={loading}
            size="lg"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <Separator className="my-6" />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Don't have an account yet?
          </p>
          <Button 
            variant="outline" 
            onClick={onShowRegister}
            className="w-full fantasy-border"
          >
            Create New Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};