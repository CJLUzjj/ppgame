import commonConfigData from '../../../config/Common.json';


export interface CommonConfig {
    frame: number;
    replayFrame: number;
}

export const CommonConfig: CommonConfig = {
    frame: commonConfigData.frame,
    replayFrame: commonConfigData.replayFrame
}
