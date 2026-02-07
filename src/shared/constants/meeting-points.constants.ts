export const PREDEFINED_MEETING_POINTS = [
  {
    name: "Explanada",
    location: "https://maps.app.goo.gl/gCJfpLSoy3D454Y19",
  },
  {
    name: "Puerta de Alcalá",
    location: "https://maps.app.goo.gl/3kjrtMz9BtQ39BJYA",
  },
  {
    name: "Plaza de Cibeles",
    location: "https://maps.app.goo.gl/LuE7bF56QJgBtLbRA",
  },
  {
    name: "Otro", // Usuario puede poner customName
    location: undefined,
  },
] as const;

export type PredefinedMeetingPoint = (typeof PREDEFINED_MEETING_POINTS)[number];
