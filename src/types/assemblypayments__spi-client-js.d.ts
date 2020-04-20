declare module '@mx51/spi-client-js';

type Config = any;
type Logger = any;
type Message = any;
type Options = any;
type PairingFlowState = any;
type Secrets = any;
type Spi = any;
type SpiPreauth = any;
type SpiEvent = any & { detail: any };
type TransactionFlowState = any;
type TxFlowStateChangedEvent = any;
type DeviceAddressChangedEvent = any;
type StateChange = {
  Finished: boolean;
  Success: SuccessState;
  Response: any;
};
type Product = {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
};

type CategoryProducts = {
  categoryName: string;
  list: Array<Product>;
};

type AllProducts = Array<CategoryProducts>;
