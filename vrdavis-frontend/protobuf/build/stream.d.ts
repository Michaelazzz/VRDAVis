import * as $protobuf from "protobufjs";
/** Namespace VRDAVis. */
export namespace VRDAVis {

    /** Properties of a CubeData. */
    interface ICubeData {

        /** CubeData layer */
        layer?: (number|null);

        /** CubeData x */
        x?: (number|null);

        /** CubeData y */
        y?: (number|null);

        /** CubeData z */
        z?: (number|null);

        /** CubeData width */
        width?: (number|null);

        /** CubeData height */
        height?: (number|null);

        /** CubeData length */
        length?: (number|null);

        /** CubeData volumeData */
        volumeData?: (Uint8Array|null);

        /** CubeData nanEncodings */
        nanEncodings?: (Uint8Array|null);

        /** CubeData mip */
        mip?: (number|null);
    }

    /** Represents a CubeData. */
    class CubeData implements ICubeData {

        /**
         * Constructs a new CubeData.
         * @param [properties] Properties to set
         */
        constructor(properties?: VRDAVis.ICubeData);

        /** CubeData layer. */
        public layer: number;

        /** CubeData x. */
        public x: number;

        /** CubeData y. */
        public y: number;

        /** CubeData z. */
        public z: number;

        /** CubeData width. */
        public width: number;

        /** CubeData height. */
        public height: number;

        /** CubeData length. */
        public length: number;

        /** CubeData volumeData. */
        public volumeData: Uint8Array;

        /** CubeData nanEncodings. */
        public nanEncodings: Uint8Array;

        /** CubeData mip. */
        public mip: number;

        /**
         * Creates a new CubeData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CubeData instance
         */
        public static create(properties?: VRDAVis.ICubeData): VRDAVis.CubeData;

        /**
         * Encodes the specified CubeData message. Does not implicitly {@link VRDAVis.CubeData.verify|verify} messages.
         * @param message CubeData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: VRDAVis.ICubeData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CubeData message, length delimited. Does not implicitly {@link VRDAVis.CubeData.verify|verify} messages.
         * @param message CubeData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: VRDAVis.ICubeData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CubeData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CubeData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VRDAVis.CubeData;

        /**
         * Decodes a CubeData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CubeData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VRDAVis.CubeData;

        /**
         * Verifies a CubeData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CubeData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CubeData
         */
        public static fromObject(object: { [k: string]: any }): VRDAVis.CubeData;

        /**
         * Creates a plain object from a CubeData message. Also converts values to other types if specified.
         * @param message CubeData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: VRDAVis.CubeData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CubeData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
