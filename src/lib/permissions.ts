export const rolePermissions = {
  ADMIN: {
    allowed: [
      "/",
      "/dashboard",
      "/entry",
      "/diseases",
      "/registry",
      "/notifications",
      "/patients",
    ],
    denied: [],
    navItems: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "Home",
      },
      {
        title: "Entry",
        href: "/entry",
        icon: "FileText",
      },
      {
        title: "Registry",
        href: "/registry",
        icon: "FileText",
      },
      {
        title: "Diseases",
        href: "/diseases",
        icon: "Pill",
      },
      {
        title: "Notifications",
        href: "/notifications",
        icon: "Bell",
      },
    ],
  },
  LAB_DOCTOR: {
    allowed: ["/", "/dashboard", "/entry"],
    denied: ["/diseases", "/registry", "/notifications"],
    navItems: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "Home",
      },
      {
        title: "Entry",
        href: "/entry",
        icon: "FileText",
      },
    ],
  },
  INFECTIOUS_DOCTOR: {
    allowed: ["/", "/dashboard", "/diseases", "/registry", "/notifications"],
    denied: ["/entry"],
    navItems: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "Home",
      },
      {
        title: "Registry",
        href: "/registry",
        icon: "FileText",
      },
      {
        title: "Diseases",
        href: "/diseases",
        icon: "Pill",
      },
      {
        title: "Notifications",
        href: "/notifications",
        icon: "Bell",
      },
    ],
  },
};

export const publicRoutes = ["/login", "/api"];
