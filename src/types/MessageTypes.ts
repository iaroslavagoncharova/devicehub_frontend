type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  error: string;
};

type DBMessageResponse = MessageResponse & {
  data: { username: string; role: string; token: string };
};

type RoleResponse = MessageResponse & {
  data: { role: string };
};

export type { MessageResponse, ErrorResponse, DBMessageResponse, RoleResponse };
