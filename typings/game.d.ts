interface Game {
  _id?: string;
  name: string;
  users?: Array;
  inviteCode?: string;
  displayNPC: boolean;
  dm?:string;
  battle: boolean;
  createdAt: Date;
}
