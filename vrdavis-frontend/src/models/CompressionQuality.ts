export class CompressionQuality {
    public static readonly CUBE_MIN = 1;
    public static readonly CUBE_MAX = 32;
    public static readonly CUBE_STEP = 1;
    public static readonly CUBE_DEFAULT = 11;

    public static isImageCompressionQualityValid = (value: number): boolean => {
        return isFinite(value) 
        && value >= CompressionQuality.CUBE_MIN 
        && value <= CompressionQuality.CUBE_MAX;
    };
}