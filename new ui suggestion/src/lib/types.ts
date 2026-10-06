/** Plain serializable shapes passed from server components to the client. */

export type EventCardData = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  venue: string;
  startAt: string;
  endAt: string | null;
  dateLabel: string;
  timeLabel: string;
  relativeLabel: string;
  capacity: number;
  posterUrl: string | null;
  requiresApproval: boolean;
  status: string;
  clubName: string;
  clubColor: string;
  clubSlug: string;
  registeredCount: number;
  checkedInCount: number;
};

export type MyRegistrationData = {
  registrationId: string;
  status: "pending" | "confirmed" | "cancelled";
  verifyCode: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  registeredAt: string;
  certificateId: string | null;
  certificateCode: string | null;
  event: EventCardData;
};

export type NotificationData = {
  id: string;
  title: string;
  message: string;
  kind: string;
  link: string | null;
  read: boolean;
  createdAt: string;
  dateLabel: string;
};

export type StudentStats = {
  attended: number;
  workshops: number;
  hackathons: number;
  certificates: number;
  upcoming: number;
  pending: number;
};

export type ClubRegistrationRow = {
  registrationId: string;
  status: string;
  verifyCode: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  registeredAt: string;
  registeredAtLabel: string;
  checkedInAtLabel: string | null;
  userName: string;
  userEmail: string;
};

export type CertificateData = {
  id: string;
  code: string;
  issuedAt: string;
  eventTitle: string;
  eventDate: string;
  clubName: string;
};
