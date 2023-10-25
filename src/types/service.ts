import { TShirtService } from "src/nft/services/tshirt.service";
import { CalStakingService } from "src/staking/services/cal-staking.service";
import { UsdtStakingService } from "src/staking/services/usdt-staking.service";

export type ServiceMap = {
  cal: CalStakingService;
  usdt: UsdtStakingService;
  tshirt: TShirtService;
};

export type ServiceToken = keyof ServiceMap;
