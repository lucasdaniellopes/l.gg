"use client";

import { useState } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Button, 
  Link,
  Divider,
  Avatar,
  Chip,
  Progress,
  Spacer,
  CircularProgress,
  Snippet,
  Code
} from "@heroui/react";
import { Eye, EyeOff, Trophy, LogOut, Gamepad2, Lightbulb } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (email && password) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen page-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[70vh]">
            <Card className="max-w-lg w-full" shadow="lg">
              <CardHeader className="flex gap-3 justify-center pb-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar
                    src="https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/29.png"
                    className="w-20 h-20 text-large ring-4 ring-success"
                  />
                  <div className="flex items-center gap-2">
                    <Chip color="success" variant="flat" startContent="✓">
                      Connected
                    </Chip>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                    Welcome to the Rift!
                  </p>
                  <p className="text-default-600 text-center">
                    Connection established successfully
                  </p>
                </div>
              </CardHeader>
              
              <CardBody className="text-center space-y-6 px-8 pb-8">
                <Card className="bg-success/10">
                  <CardBody className="p-4">
                    <p className="text-sm text-default-600 mb-2">Active account:</p>
                    <Code color="success" className="text-base font-semibold">
                      {email}
                    </Code>
                  </CardBody>
                </Card>
                
                <p className="text-default-700 leading-relaxed">
                  Your connection to the champions&apos; dimension has been established. 
                  Explore epic abilities, discover legendary stories and 
                  master the knowledge of the Rift.
                </p>
                
                <Progress
                  label="Connection status"
                  value={100}
                  color="success"
                  showValueLabel={true}
                  className="max-w-md mx-auto"
                />

                <Spacer y={2} />
                
                <div className="flex gap-3 justify-center flex-col sm:flex-row">
                  <Button 
                    as={Link} 
                    href="/" 
                    color="primary"
                    size="lg"
                    className="font-bold"
                    startContent={<Trophy className="w-4 h-4" />}
                  >
                    Explore Champions
                  </Button>
                  <Button 
                    variant="bordered" 
                    onPress={handleLogout}
                    color="danger"
                    size="lg"
                    startContent={<LogOut className="w-4 h-4" />}
                  >
                    Disconnect
                  </Button>
                </div>
                
                <Spacer y={4} />
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-primary/10">
                    <CardBody className="p-3 text-center">
                      <p className="text-2xl font-bold text-primary">168+</p>
                      <p className="text-xs text-default-600">Champions</p>
                    </CardBody>
                  </Card>
                  <Card className="bg-secondary/10">
                    <CardBody className="p-3 text-center">
                      <p className="text-2xl font-bold text-secondary">∞</p>
                      <p className="text-xs text-default-600">Builds</p>
                    </CardBody>
                  </Card>
                </div>
              </CardBody>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[70vh]">
          <Card className="max-w-md w-full" shadow="lg">
            <CardHeader className="flex gap-3 justify-center pb-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar
                  src="https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/588.png"
                  className="w-16 h-16 text-large ring-4 ring-primary/20"
                />
                <div className="flex items-center gap-2">
                  <Chip color="warning" variant="flat" size="sm">
                    Access Required
                  </Chip>
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Enter the Rift
                </p>
                <p className="text-default-600 text-center">
                  Connect to the champions&apos; dimension
                </p>
              </div>
            </CardHeader>
            
            <CardBody className="space-y-6 px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <Input
                  label="Summoner Email"
                  placeholder="summoner@rift.com"
                  type="email"
                  variant="bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                  description="Enter your summoner email"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">@</span>
                    </div>
                  }
                />
                <Input
                  label="Rift Password"
                  placeholder="••••••••"
                  variant="bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <Eye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  isRequired
                  description="Enter your secret password"
                />

                {isLoading && (
                  <Card className="bg-primary/10">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-3">
                        <CircularProgress
                          size="sm"
                          color="primary"
                          aria-label="Conectando..."
                        />
                        <div>
                          <p className="text-sm font-medium">Connecting to the Rift...</p>
                          <p className="text-xs text-default-500">Establishing secure connection</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}

                <Button 
                  type="submit" 
                  color="primary"
                  size="lg"
                  className="w-full font-bold"
                  isLoading={isLoading}
                  isDisabled={!email || !password}
                  startContent={!isLoading ? <Gamepad2 className="w-4 h-4" /> : undefined}
                >
                  {isLoading ? "Connecting..." : "Enter the Rift"}
                </Button>
              </form>
              
              <Divider />
              
              <div className="text-center space-y-4">
                <p className="text-sm text-default-600">
                  New summoner?{" "}
                  <Link href="#" color="primary" className="font-medium">
                    Create account
                  </Link>
                </p>
                
                <Snippet
                  variant="flat"
                  color="success"
                  symbol={<Lightbulb className="w-3 h-3" />}
                  className="text-tiny"
                >
                  Demo: Use any valid email and password
                </Snippet>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}