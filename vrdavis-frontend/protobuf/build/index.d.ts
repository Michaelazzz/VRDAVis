import * as $protobuf from "protobufjs";
/** Namespace VRDAVis. */
export namespace VRDAVis {

    /** Properties of a Cubelet. */
    interface ICubelet {

        /** Cubelet layer */
        layer?: (number|null);

        /** Cubelet x */
        x?: (number|null);

        /** Cubelet y */
        y?: (number|null);

        /** Cubelet z */
        z?: (number|null);

        /** Cubelet width */
        width?: (number|null);

        /** Cubelet height */
        height?: (number|null);

        /** Cubelet length */
        length?: (number|null);

        /** Cubelet volumeData */
        volumeData?: (Uint8Array|null);

        /** Cubelet nanEncodings */
        nanEncodings?: (Uint8Array|null);

        /** Cubelet mip */
        mip?: (number|null);
    }

    /** Represents a Cubelet. */
    class Cubelet implements ICubelet {

        /**
         * Constructs a new Cubelet.
         * @param [properties] Properties to set
         */
        constructor(properties?: VRDAVis.ICubelet);

        /** Cubelet layer. */
        public layer: number;

        /** Cubelet x. */
        public x: number;

        /** Cubelet y. */
        public y: number;

        /** Cubelet z. */
        public z: number;

        /** Cubelet width. */
        public width: number;

        /** Cubelet height. */
        public height: number;

        /** Cubelet length. */
        public length: number;

        /** Cubelet volumeData. */
        public volumeData: Uint8Array;

        /** Cubelet nanEncodings. */
        public nanEncodings: Uint8Array;

        /** Cubelet mip. */
        public mip: number;

        /**
         * Creates a new Cubelet instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Cubelet instance
         */
        public static create(properties?: VRDAVis.ICubelet): VRDAVis.Cubelet;

        /**
         * Encodes the specified Cubelet message. Does not implicitly {@link VRDAVis.Cubelet.verify|verify} messages.
         * @param message Cubelet message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: VRDAVis.ICubelet, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Cubelet message, length delimited. Does not implicitly {@link VRDAVis.Cubelet.verify|verify} messages.
         * @param message Cubelet message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: VRDAVis.ICubelet, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Cubelet message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Cubelet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VRDAVis.Cubelet;

        /**
         * Decodes a Cubelet message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Cubelet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VRDAVis.Cubelet;

        /**
         * Verifies a Cubelet message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Cubelet message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Cubelet
         */
        public static fromObject(object: { [k: string]: any }): VRDAVis.Cubelet;

        /**
         * Creates a plain object from a Cubelet message. Also converts values to other types if specified.
         * @param message Cubelet
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: VRDAVis.Cubelet, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Cubelet to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** EventType enum. */
    enum EventType {
        EMPTY_EVENT = 0,
        REGISTER_VIEWER = 1,
        REGISTER_VIEWER_ACK = 2,
        CUBE_DATA = 3
    }

    /** SessionType enum. */
    enum SessionType {
        NEW = 0,
        RESUMED = 1
    }

    /** Properties of an AddRequiredCubes. */
    interface IAddRequiredCubes {

        /** AddRequiredCubes fileId */
        fileId?: (number|null);

        /** AddRequiredCubes cubes */
        cubes?: (number[]|null);
    }

    /** Represents an AddRequiredCubes. */
    class AddRequiredCubes implements IAddRequiredCubes {

        /**
         * Constructs a new AddRequiredCubes.
         * @param [properties] Properties to set
         */
        constructor(properties?: VRDAVis.IAddRequiredCubes);

        /** AddRequiredCubes fileId. */
        public fileId: number;

        /** AddRequiredCubes cubes. */
        public cubes: number[];

        /**
         * Creates a new AddRequiredCubes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddRequiredCubes instance
         */
        public static create(properties?: VRDAVis.IAddRequiredCubes): VRDAVis.AddRequiredCubes;

        /**
         * Encodes the specified AddRequiredCubes message. Does not implicitly {@link VRDAVis.AddRequiredCubes.verify|verify} messages.
         * @param message AddRequiredCubes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: VRDAVis.IAddRequiredCubes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddRequiredCubes message, length delimited. Does not implicitly {@link VRDAVis.AddRequiredCubes.verify|verify} messages.
         * @param message AddRequiredCubes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: VRDAVis.IAddRequiredCubes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddRequiredCubes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddRequiredCubes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VRDAVis.AddRequiredCubes;

        /**
         * Decodes an AddRequiredCubes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddRequiredCubes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VRDAVis.AddRequiredCubes;

        /**
         * Verifies an AddRequiredCubes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddRequiredCubes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddRequiredCubes
         */
        public static fromObject(object: { [k: string]: any }): VRDAVis.AddRequiredCubes;

        /**
         * Creates a plain object from an AddRequiredCubes message. Also converts values to other types if specified.
         * @param message AddRequiredCubes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: VRDAVis.AddRequiredCubes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddRequiredCubes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RemoveRequiredTiles. */
    interface IRemoveRequiredTiles {

        /** RemoveRequiredTiles fileId */
        fileId?: (number|null);

        /** RemoveRequiredTiles cubes */
        cubes?: (number[]|null);
    }

    /** Represents a RemoveRequiredTiles. */
    class RemoveRequiredTiles implements IRemoveRequiredTiles {

        /**
         * Constructs a new RemoveRequiredTiles.
         * @param [properties] Properties to set
         */
        constructor(properties?: VRDAVis.IRemoveRequiredTiles);

        /** RemoveRequiredTiles fileId. */
        public fileId: number;

        /** RemoveRequiredTiles cubes. */
        public cubes: number[];

        /**
         * Creates a new RemoveRequiredTiles instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RemoveRequiredTiles instance
         */
        public static create(properties?: VRDAVis.IRemoveRequiredTiles): VRDAVis.RemoveRequiredTiles;

        /**
         * Encodes the specified RemoveRequiredTiles message. Does not implicitly {@link VRDAVis.RemoveRequiredTiles.verify|verify} messages.
         * @param message RemoveRequiredTiles message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: VRDAVis.IRemoveRequiredTiles, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RemoveRequiredTiles message, length delimited. Does not implicitly {@link VRDAVis.RemoveRequiredTiles.verify|verify} messages.
         * @param message RemoveRequiredTiles message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: VRDAVis.IRemoveRequiredTiles, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RemoveRequiredTiles message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RemoveRequiredTiles
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VRDAVis.RemoveRequiredTiles;

        /**
         * Decodes a RemoveRequiredTiles message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RemoveRequiredTiles
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VRDAVis.RemoveRequiredTiles;

        /**
         * Verifies a RemoveRequiredTiles message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RemoveRequiredTiles message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RemoveRequiredTiles
         */
        public static fromObject(object: { [k: string]: any }): VRDAVis.RemoveRequiredTiles;

        /**
         * Creates a plain object from a RemoveRequiredTiles message. Also converts values to other types if specified.
         * @param message RemoveRequiredTiles
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: VRDAVis.RemoveRequiredTiles, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RemoveRequiredTiles to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RegisterViewer. */
    interface IRegisterViewer {

        /** RegisterViewer sessionId */
        sessionId?: (number|null);
    }

    /** Represents a RegisterViewer. */
    class RegisterViewer implements IRegisterViewer {

        /**
         * Constructs a new RegisterViewer.
         * @param [properties] Properties to set
         */
        constructor(properties?: VRDAVis.IRegisterViewer);

        /** RegisterViewer sessionId. */
        public sessionId: number;

        /**
         * Creates a new RegisterViewer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RegisterViewer instance
         */
        public static create(properties?: VRDAVis.IRegisterViewer): VRDAVis.RegisterViewer;

        /**
         * Encodes the specified RegisterViewer message. Does not implicitly {@link VRDAVis.RegisterViewer.verify|verify} messages.
         * @param message RegisterViewer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: VRDAVis.IRegisterViewer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RegisterViewer message, length delimited. Does not implicitly {@link VRDAVis.RegisterViewer.verify|verify} messages.
         * @param message RegisterViewer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: VRDAVis.IRegisterViewer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RegisterViewer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RegisterViewer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VRDAVis.RegisterViewer;

        /**
         * Decodes a RegisterViewer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RegisterViewer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VRDAVis.RegisterViewer;

        /**
         * Verifies a RegisterViewer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RegisterViewer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RegisterViewer
         */
        public static fromObject(object: { [k: string]: any }): VRDAVis.RegisterViewer;

        /**
         * Creates a plain object from a RegisterViewer message. Also converts values to other types if specified.
         * @param message RegisterViewer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: VRDAVis.RegisterViewer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RegisterViewer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RegisterViewerAck. */
    interface IRegisterViewerAck {

        /** RegisterViewerAck sessionId */
        sessionId?: (number|null);

        /** RegisterViewerAck success */
        success?: (boolean|null);

        /** RegisterViewerAck message */
        message?: (string|null);
    }

    /** Represents a RegisterViewerAck. */
    class RegisterViewerAck implements IRegisterViewerAck {

        /**
         * Constructs a new RegisterViewerAck.
         * @param [properties] Properties to set
         */
        constructor(properties?: VRDAVis.IRegisterViewerAck);

        /** RegisterViewerAck sessionId. */
        public sessionId: number;

        /** RegisterViewerAck success. */
        public success: boolean;

        /** RegisterViewerAck message. */
        public message: string;

        /**
         * Creates a new RegisterViewerAck instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RegisterViewerAck instance
         */
        public static create(properties?: VRDAVis.IRegisterViewerAck): VRDAVis.RegisterViewerAck;

        /**
         * Encodes the specified RegisterViewerAck message. Does not implicitly {@link VRDAVis.RegisterViewerAck.verify|verify} messages.
         * @param message RegisterViewerAck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: VRDAVis.IRegisterViewerAck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RegisterViewerAck message, length delimited. Does not implicitly {@link VRDAVis.RegisterViewerAck.verify|verify} messages.
         * @param message RegisterViewerAck message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: VRDAVis.IRegisterViewerAck, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RegisterViewerAck message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RegisterViewerAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VRDAVis.RegisterViewerAck;

        /**
         * Decodes a RegisterViewerAck message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RegisterViewerAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VRDAVis.RegisterViewerAck;

        /**
         * Verifies a RegisterViewerAck message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RegisterViewerAck message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RegisterViewerAck
         */
        public static fromObject(object: { [k: string]: any }): VRDAVis.RegisterViewerAck;

        /**
         * Creates a plain object from a RegisterViewerAck message. Also converts values to other types if specified.
         * @param message RegisterViewerAck
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: VRDAVis.RegisterViewerAck, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RegisterViewerAck to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

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
