export interface IPairingProps {
  pairing_id: string;
  signing_secret_part_b: string;
  spi_cloud_api_base_url: string;
}

export interface IPairingState {
  [key: string]: IPairingProps;
}
