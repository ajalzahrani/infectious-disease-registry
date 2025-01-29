export const rolePermissions = {
  ADMIN: {
    allowed: [
      "/",
      "/dashboard",
      "/patients",
      "/diseases",
      "/registry",
      "/notifications",
    ],
    denied: [],
    navItems: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "Home",
      },
      {
        title: "Register Patient",
        href: "/patients/register",
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
    allowed: ["/", "/dashboard", "/patients/register"],
    denied: ["/diseases", "/registry", "/notifications"],
    navItems: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "Home",
      },
      {
        title: "Register Patient",
        href: "/patients/register",
        icon: "FileText",
      },
    ],
  },
  INFECTIOUS_DOCTOR: {
    allowed: ["/", "/dashboard", "/diseases", "/registry", "/notifications"],
    denied: ["/patients/register"],
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
