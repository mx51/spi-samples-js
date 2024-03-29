declare module '@mx51/spi-client-js';

type Record<K extends keyof T> = {
  [P in K]: T;
};

// global definitions for spi-client-js package
// type Any = any;
type Any = Record;

type Tenant = {
  code: string;
  name: string;
};

type TenantList = Array<Tenant>;

type TenantListResponse = {
  Data: TenantList;
};
