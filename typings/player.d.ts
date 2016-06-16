interface Player{
  _id?: string;
  name?: string;
  currentHealth?: number;
  maxHealth?: number;
  game?: string;
  recovery?: string;
  tempHealth?: object;
  battle?: object;
  conditions?: array;
  owner?: string;
  npc?: boolean;
  real?: boolean;
  createdAt?: Date;
}
