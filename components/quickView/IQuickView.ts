export interface States {
    active: string,
    confirmed: string,
    deaths: string,
    delta: {
        active: number,
        confirmed: number,
        recovered: number,
        deaths: number
    },
    lastupdatedtime: string,
    recovered: string,
    state: string
} 

export interface Deltas {
    confirmeddelta: string,
    counterforautotimeupdate: string,
    deceaseddelta: string,
    lastupdatedtime: string,
    recovereddelta: string,
    statesdelta: string
}

export interface CurrentHoveredRegion { 
    name: string,
    lastupdatedtime: string,
    confirmed: any,
    active: any,
    recovered: any,
    deaths: any,
    Unknown: any,
}

export interface CurrentMapData {
    mapType: string,
    name: string,
    Unknown: number,
}