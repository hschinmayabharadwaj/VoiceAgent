'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookHeart,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  SmilePlus,
  Sparkles,
  LogOut,
  LogIn,
  User as UserIcon,
  Gamepad2,
  Mic,
  Bot,
  Brain,
  Rocket,
  Settings,
  Phone,
  Heart,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';
import { useLanguage } from '@/contexts/language-context';

const menuItems = [
  { href: '/', label: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/check-in', label: 'nav.checkin', icon: SmilePlus },
  { href: '/progress', label: 'nav.progress', icon: LineChart },
  { href: '/mindfulness', label: 'nav.mindfulness', icon: Brain },
  { href: '/forum', label: 'nav.forum', icon: MessageSquare },
  { href: '/games', label: 'nav.games', icon: Gamepad2 },
  { href: '/voice-agent', label: 'nav.voiceAgent', icon: Mic },
  { href: '/motion-arcade', label: 'nav.motionArcade', icon: Rocket },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/login');
    }
  };

  const getUserInitial = () => {
    if (!user) return 'G';
    if (user.isAnonymous) return 'A';
    if (user.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserName = () => {
    if (!user) return 'Guest';
    if (user.isAnonymous) return 'Anonymous User';
    return user.displayName || user.email || 'User';
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            whileHover={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>
          <h1 className="text-xl font-bold font-headline">ManasMitra</h1>
        </motion.div>
      </SidebarHeader>
      <SidebarContent>
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <SidebarMenu>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                variants={staggerItemVariants}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={t(item.label)}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{t(item.label)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            ))}
            
            {/* Divider */}
            <div className="my-2 mx-2 border-t border-sidebar-border" />
            
            {/* Settings */}
            <motion.div variants={staggerItemVariants}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/settings'}
                  tooltip={t('common.settings')}
                >
                  <Link href="/settings">
                    <Settings />
                    <span>{t('common.settings')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </motion.div>
          </SidebarMenu>
        </motion.div>
        
        {/* Crisis Helpline Quick Access */}
        <div className="mt-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3"
          >
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-2">
              <Heart className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm font-semibold">{t('crisis.needHelp')}</span>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mb-2">
              {t('crisis.helpAvailable')}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2 text-red-700 border-red-300 hover:bg-red-100 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
              onClick={() => window.open('tel:988', '_blank')}
            >
              <Phone className="w-3 h-3" aria-hidden="true" />
              <span suppressHydrationWarning>Call 988</span>
            </Button>
          </motion.div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        {isUserLoading ? (
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">Loading...</span>
            </div>
          </div>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-between p-2 w-full hover:bg-sidebar-accent rounded-md cursor-pointer transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Avatar>
                    <AvatarImage
                      src={user.photoURL || userAvatar?.imageUrl}
                      data-ai-hint={userAvatar?.imageHint}
                    />
                    <AvatarFallback>{getUserInitial()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="text-sm font-semibold truncate">
                      {getUserName()}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Login">
                <Link href="/login">
                  <LogIn />
                  <span>Login</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
