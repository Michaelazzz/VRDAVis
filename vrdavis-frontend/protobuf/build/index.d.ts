import * as $protobuf from "protobufjs";
/** Namespace VRDAVis. */
export namespace VRDAVis {

    /** Properties of a VolumeDataCube. */
    interface IVolumeDataCube {

        /** VolumeDataCube volumeData */
        volumeData?: (Uint8Array|null);
    }

    /** Represents a VolumeDataCube. */
    class VolumeDataCube implements IVolumeDataCube {

        /**
         * Constructs a new VolumeDataCube.
         * @param [properties] Properties to set
         */
        constructor(properties?: VRDAVis.IVolumeDataCube);

        /** VolumeDataCube volumeData. */
        public volumeData: Uint8Array;

        /**
         * Creates a new VolumeDataCube instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VolumeDataCube instance
         */
        public static create(properties?: VRDAVis.IVolumeDataCube): VRDAVis.VolumeDataCube;

        /**
         * Encodes the specified VolumeDataCube message. Does not implicitly {@link VRDAVis.VolumeDataCube.verify|verify} messages.
         * @param message VolumeDataCube message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: VRDAVis.IVolumeDataCube, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VolumeDataCube message, length delimited. Does not implicitly {@link VRDAVis.VolumeDataCube.verify|verify} messages.
         * @param message VolumeDataCube message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: VRDAVis.IVolumeDataCube, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VolumeDataCube message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VolumeDataCube
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VRDAVis.VolumeDataCube;

        /**
         * Decodes a VolumeDataCube message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VolumeDataCube
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VRDAVis.VolumeDataCube;

        /**
         * Verifies a VolumeDataCube message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VolumeDataCube message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VolumeDataCube
         */
        public static fromObject(object: { [k: string]: any }): VRDAVis.VolumeDataCube;

        /**
         * Creates a plain object from a VolumeDataCube message. Also converts values to other types if specified.
         * @param message VolumeDataCube
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: VRDAVis.VolumeDataCube, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VolumeDataCube to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** EventType enum. */
    enum EventType {
        EMPTY_EVENT = 0,
        REGISTER_VIEWER = 1,
        REGISTER_VIEWER_ACK = 2,
        VOLUME_DATA = 32
    }

    /** SessionType enum. */
    enum SessionType {
        NEW = 0,
        RESUMED = 1
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

    /** Properties of a VolumeData. */
    interface IVolumeData {

        /** VolumeData cubes */
        cubes?: (VRDAVis.IVolumeDataCube[]|null);
    }

    /** Represents a VolumeData. */
    class VolumeData implements IVolumeData {

        /**
         * Constructs a new VolumeData.
         * @param [properties] Properties to set
         */
        constructor(properties?: VRDAVis.IVolumeData);

        /** VolumeData cubes. */
        public cubes: VRDAVis.IVolumeDataCube[];

        /**
         * Creates a new VolumeData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VolumeData instance
         */
        public static create(properties?: VRDAVis.IVolumeData): VRDAVis.VolumeData;

        /**
         * Encodes the specified VolumeData message. Does not implicitly {@link VRDAVis.VolumeData.verify|verify} messages.
         * @param message VolumeData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: VRDAVis.IVolumeData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VolumeData message, length delimited. Does not implicitly {@link VRDAVis.VolumeData.verify|verify} messages.
         * @param message VolumeData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: VRDAVis.IVolumeData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VolumeData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VolumeData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VRDAVis.VolumeData;

        /**
         * Decodes a VolumeData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VolumeData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VRDAVis.VolumeData;

        /**
         * Verifies a VolumeData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VolumeData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VolumeData
         */
        public static fromObject(object: { [k: string]: any }): VRDAVis.VolumeData;

        /**
         * Creates a plain object from a VolumeData message. Also converts values to other types if specified.
         * @param message VolumeData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: VRDAVis.VolumeData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VolumeData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
