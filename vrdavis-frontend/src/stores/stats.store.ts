import { ObservableMap, makeAutoObservable } from "mobx";
import { VRDAVis } from "vrdavis-protobuf";
import { RootStore } from "./root.store";

export class StatsStore {

    rootStore: RootStore;
    regionStats: Map<string, ObservableMap<string, ObservableMap<string, VRDAVis.RegionStatsData>>>;

    mean: number;
    min: number;
    max: number;
    distributionValues: number[];
    distributionLabels: number[];

    regionSet: boolean;

    constructor (rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;

        this.regionStats = new Map<string, ObservableMap<string, ObservableMap<string, VRDAVis.RegionStatsData>>>();
        this.rootStore.backendStore.statsStream.subscribe(this.handleRegionStatsStream);

        this.mean = 0;
        this.min = 0;
        this.max = 0;
        this.distributionValues = [];
        this.distributionLabels = [];

        this.regionSet = false;
    }

    handleRegionStatsStream = (regionStatsData: VRDAVis.RegionStatsData) => {
        if (!regionStatsData) {
            return;
        }

        for (let i = 0; i< regionStatsData.statistics.length; i++) {
            if(regionStatsData.statistics[i].statsType === VRDAVis.StatsType.Mean) this.mean = regionStatsData.statistics[i].value!;
            if(regionStatsData.statistics[i].statsType === VRDAVis.StatsType.Min) this.min = regionStatsData.statistics[i].value!;
            if(regionStatsData.statistics[i].statsType === VRDAVis.StatsType.Max) this.max = regionStatsData.statistics[i].value!;
            if(regionStatsData.statistics[i].statsType === VRDAVis.StatsType.Distribution) { 
                this.distributionLabels = regionStatsData.statistics[i].ranges!;
                this.distributionValues = regionStatsData.statistics[i].values!;
            }
        }
    };

    setRegionStatus = (setRegionResponse: VRDAVis.SetRegionResponse) => {
        if (!setRegionResponse) {
            return;
        }

        this.regionSet = setRegionResponse.success;
    }
}