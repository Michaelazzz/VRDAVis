/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const VRDAVis = $root.VRDAVis = (() => {

    /**
     * Namespace VRDAVis.
     * @exports VRDAVis
     * @namespace
     */
    const VRDAVis = {};

    VRDAVis.VolumeDataCube = (function() {

        /**
         * Properties of a VolumeDataCube.
         * @memberof VRDAVis
         * @interface IVolumeDataCube
         * @property {Uint8Array|null} [volumeData] VolumeDataCube volumeData
         */

        /**
         * Constructs a new VolumeDataCube.
         * @memberof VRDAVis
         * @classdesc Represents a VolumeDataCube.
         * @implements IVolumeDataCube
         * @constructor
         * @param {VRDAVis.IVolumeDataCube=} [properties] Properties to set
         */
        function VolumeDataCube(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VolumeDataCube volumeData.
         * @member {Uint8Array} volumeData
         * @memberof VRDAVis.VolumeDataCube
         * @instance
         */
        VolumeDataCube.prototype.volumeData = $util.newBuffer([]);

        /**
         * Creates a new VolumeDataCube instance using the specified properties.
         * @function create
         * @memberof VRDAVis.VolumeDataCube
         * @static
         * @param {VRDAVis.IVolumeDataCube=} [properties] Properties to set
         * @returns {VRDAVis.VolumeDataCube} VolumeDataCube instance
         */
        VolumeDataCube.create = function create(properties) {
            return new VolumeDataCube(properties);
        };

        /**
         * Encodes the specified VolumeDataCube message. Does not implicitly {@link VRDAVis.VolumeDataCube.verify|verify} messages.
         * @function encode
         * @memberof VRDAVis.VolumeDataCube
         * @static
         * @param {VRDAVis.IVolumeDataCube} message VolumeDataCube message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VolumeDataCube.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.volumeData != null && Object.hasOwnProperty.call(message, "volumeData"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.volumeData);
            return writer;
        };

        /**
         * Encodes the specified VolumeDataCube message, length delimited. Does not implicitly {@link VRDAVis.VolumeDataCube.verify|verify} messages.
         * @function encodeDelimited
         * @memberof VRDAVis.VolumeDataCube
         * @static
         * @param {VRDAVis.IVolumeDataCube} message VolumeDataCube message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VolumeDataCube.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VolumeDataCube message from the specified reader or buffer.
         * @function decode
         * @memberof VRDAVis.VolumeDataCube
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {VRDAVis.VolumeDataCube} VolumeDataCube
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VolumeDataCube.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.VRDAVis.VolumeDataCube();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.volumeData = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a VolumeDataCube message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof VRDAVis.VolumeDataCube
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {VRDAVis.VolumeDataCube} VolumeDataCube
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VolumeDataCube.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VolumeDataCube message.
         * @function verify
         * @memberof VRDAVis.VolumeDataCube
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VolumeDataCube.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.volumeData != null && message.hasOwnProperty("volumeData"))
                if (!(message.volumeData && typeof message.volumeData.length === "number" || $util.isString(message.volumeData)))
                    return "volumeData: buffer expected";
            return null;
        };

        /**
         * Creates a VolumeDataCube message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof VRDAVis.VolumeDataCube
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {VRDAVis.VolumeDataCube} VolumeDataCube
         */
        VolumeDataCube.fromObject = function fromObject(object) {
            if (object instanceof $root.VRDAVis.VolumeDataCube)
                return object;
            let message = new $root.VRDAVis.VolumeDataCube();
            if (object.volumeData != null)
                if (typeof object.volumeData === "string")
                    $util.base64.decode(object.volumeData, message.volumeData = $util.newBuffer($util.base64.length(object.volumeData)), 0);
                else if (object.volumeData.length >= 0)
                    message.volumeData = object.volumeData;
            return message;
        };

        /**
         * Creates a plain object from a VolumeDataCube message. Also converts values to other types if specified.
         * @function toObject
         * @memberof VRDAVis.VolumeDataCube
         * @static
         * @param {VRDAVis.VolumeDataCube} message VolumeDataCube
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VolumeDataCube.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.volumeData = "";
                else {
                    object.volumeData = [];
                    if (options.bytes !== Array)
                        object.volumeData = $util.newBuffer(object.volumeData);
                }
            if (message.volumeData != null && message.hasOwnProperty("volumeData"))
                object.volumeData = options.bytes === String ? $util.base64.encode(message.volumeData, 0, message.volumeData.length) : options.bytes === Array ? Array.prototype.slice.call(message.volumeData) : message.volumeData;
            return object;
        };

        /**
         * Converts this VolumeDataCube to JSON.
         * @function toJSON
         * @memberof VRDAVis.VolumeDataCube
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VolumeDataCube.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for VolumeDataCube
         * @function getTypeUrl
         * @memberof VRDAVis.VolumeDataCube
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        VolumeDataCube.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/VRDAVis.VolumeDataCube";
        };

        return VolumeDataCube;
    })();

    /**
     * EventType enum.
     * @name VRDAVis.EventType
     * @enum {number}
     * @property {number} EMPTY_EVENT=0 EMPTY_EVENT value
     * @property {number} REGISTER_VIEWER=1 REGISTER_VIEWER value
     * @property {number} REGISTER_VIEWER_ACK=2 REGISTER_VIEWER_ACK value
     * @property {number} VOLUME_DATA=32 VOLUME_DATA value
     */
    VRDAVis.EventType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "EMPTY_EVENT"] = 0;
        values[valuesById[1] = "REGISTER_VIEWER"] = 1;
        values[valuesById[2] = "REGISTER_VIEWER_ACK"] = 2;
        values[valuesById[32] = "VOLUME_DATA"] = 32;
        return values;
    })();

    /**
     * SessionType enum.
     * @name VRDAVis.SessionType
     * @enum {number}
     * @property {number} NEW=0 NEW value
     * @property {number} RESUMED=1 RESUMED value
     */
    VRDAVis.SessionType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NEW"] = 0;
        values[valuesById[1] = "RESUMED"] = 1;
        return values;
    })();

    VRDAVis.RegisterViewer = (function() {

        /**
         * Properties of a RegisterViewer.
         * @memberof VRDAVis
         * @interface IRegisterViewer
         * @property {number|null} [sessionId] RegisterViewer sessionId
         */

        /**
         * Constructs a new RegisterViewer.
         * @memberof VRDAVis
         * @classdesc Represents a RegisterViewer.
         * @implements IRegisterViewer
         * @constructor
         * @param {VRDAVis.IRegisterViewer=} [properties] Properties to set
         */
        function RegisterViewer(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RegisterViewer sessionId.
         * @member {number} sessionId
         * @memberof VRDAVis.RegisterViewer
         * @instance
         */
        RegisterViewer.prototype.sessionId = 0;

        /**
         * Creates a new RegisterViewer instance using the specified properties.
         * @function create
         * @memberof VRDAVis.RegisterViewer
         * @static
         * @param {VRDAVis.IRegisterViewer=} [properties] Properties to set
         * @returns {VRDAVis.RegisterViewer} RegisterViewer instance
         */
        RegisterViewer.create = function create(properties) {
            return new RegisterViewer(properties);
        };

        /**
         * Encodes the specified RegisterViewer message. Does not implicitly {@link VRDAVis.RegisterViewer.verify|verify} messages.
         * @function encode
         * @memberof VRDAVis.RegisterViewer
         * @static
         * @param {VRDAVis.IRegisterViewer} message RegisterViewer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterViewer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sessionId != null && Object.hasOwnProperty.call(message, "sessionId"))
                writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.sessionId);
            return writer;
        };

        /**
         * Encodes the specified RegisterViewer message, length delimited. Does not implicitly {@link VRDAVis.RegisterViewer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof VRDAVis.RegisterViewer
         * @static
         * @param {VRDAVis.IRegisterViewer} message RegisterViewer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterViewer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RegisterViewer message from the specified reader or buffer.
         * @function decode
         * @memberof VRDAVis.RegisterViewer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {VRDAVis.RegisterViewer} RegisterViewer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterViewer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.VRDAVis.RegisterViewer();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.sessionId = reader.fixed32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RegisterViewer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof VRDAVis.RegisterViewer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {VRDAVis.RegisterViewer} RegisterViewer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterViewer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RegisterViewer message.
         * @function verify
         * @memberof VRDAVis.RegisterViewer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RegisterViewer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sessionId != null && message.hasOwnProperty("sessionId"))
                if (!$util.isInteger(message.sessionId))
                    return "sessionId: integer expected";
            return null;
        };

        /**
         * Creates a RegisterViewer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof VRDAVis.RegisterViewer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {VRDAVis.RegisterViewer} RegisterViewer
         */
        RegisterViewer.fromObject = function fromObject(object) {
            if (object instanceof $root.VRDAVis.RegisterViewer)
                return object;
            let message = new $root.VRDAVis.RegisterViewer();
            if (object.sessionId != null)
                message.sessionId = object.sessionId >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a RegisterViewer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof VRDAVis.RegisterViewer
         * @static
         * @param {VRDAVis.RegisterViewer} message RegisterViewer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RegisterViewer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.sessionId = 0;
            if (message.sessionId != null && message.hasOwnProperty("sessionId"))
                object.sessionId = message.sessionId;
            return object;
        };

        /**
         * Converts this RegisterViewer to JSON.
         * @function toJSON
         * @memberof VRDAVis.RegisterViewer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RegisterViewer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RegisterViewer
         * @function getTypeUrl
         * @memberof VRDAVis.RegisterViewer
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RegisterViewer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/VRDAVis.RegisterViewer";
        };

        return RegisterViewer;
    })();

    VRDAVis.RegisterViewerAck = (function() {

        /**
         * Properties of a RegisterViewerAck.
         * @memberof VRDAVis
         * @interface IRegisterViewerAck
         * @property {number|null} [sessionId] RegisterViewerAck sessionId
         * @property {boolean|null} [success] RegisterViewerAck success
         * @property {string|null} [message] RegisterViewerAck message
         */

        /**
         * Constructs a new RegisterViewerAck.
         * @memberof VRDAVis
         * @classdesc Represents a RegisterViewerAck.
         * @implements IRegisterViewerAck
         * @constructor
         * @param {VRDAVis.IRegisterViewerAck=} [properties] Properties to set
         */
        function RegisterViewerAck(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RegisterViewerAck sessionId.
         * @member {number} sessionId
         * @memberof VRDAVis.RegisterViewerAck
         * @instance
         */
        RegisterViewerAck.prototype.sessionId = 0;

        /**
         * RegisterViewerAck success.
         * @member {boolean} success
         * @memberof VRDAVis.RegisterViewerAck
         * @instance
         */
        RegisterViewerAck.prototype.success = false;

        /**
         * RegisterViewerAck message.
         * @member {string} message
         * @memberof VRDAVis.RegisterViewerAck
         * @instance
         */
        RegisterViewerAck.prototype.message = "";

        /**
         * Creates a new RegisterViewerAck instance using the specified properties.
         * @function create
         * @memberof VRDAVis.RegisterViewerAck
         * @static
         * @param {VRDAVis.IRegisterViewerAck=} [properties] Properties to set
         * @returns {VRDAVis.RegisterViewerAck} RegisterViewerAck instance
         */
        RegisterViewerAck.create = function create(properties) {
            return new RegisterViewerAck(properties);
        };

        /**
         * Encodes the specified RegisterViewerAck message. Does not implicitly {@link VRDAVis.RegisterViewerAck.verify|verify} messages.
         * @function encode
         * @memberof VRDAVis.RegisterViewerAck
         * @static
         * @param {VRDAVis.IRegisterViewerAck} message RegisterViewerAck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterViewerAck.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sessionId != null && Object.hasOwnProperty.call(message, "sessionId"))
                writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.sessionId);
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.success);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified RegisterViewerAck message, length delimited. Does not implicitly {@link VRDAVis.RegisterViewerAck.verify|verify} messages.
         * @function encodeDelimited
         * @memberof VRDAVis.RegisterViewerAck
         * @static
         * @param {VRDAVis.IRegisterViewerAck} message RegisterViewerAck message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterViewerAck.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RegisterViewerAck message from the specified reader or buffer.
         * @function decode
         * @memberof VRDAVis.RegisterViewerAck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {VRDAVis.RegisterViewerAck} RegisterViewerAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterViewerAck.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.VRDAVis.RegisterViewerAck();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.sessionId = reader.fixed32();
                        break;
                    }
                case 2: {
                        message.success = reader.bool();
                        break;
                    }
                case 3: {
                        message.message = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RegisterViewerAck message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof VRDAVis.RegisterViewerAck
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {VRDAVis.RegisterViewerAck} RegisterViewerAck
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterViewerAck.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RegisterViewerAck message.
         * @function verify
         * @memberof VRDAVis.RegisterViewerAck
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RegisterViewerAck.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sessionId != null && message.hasOwnProperty("sessionId"))
                if (!$util.isInteger(message.sessionId))
                    return "sessionId: integer expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates a RegisterViewerAck message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof VRDAVis.RegisterViewerAck
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {VRDAVis.RegisterViewerAck} RegisterViewerAck
         */
        RegisterViewerAck.fromObject = function fromObject(object) {
            if (object instanceof $root.VRDAVis.RegisterViewerAck)
                return object;
            let message = new $root.VRDAVis.RegisterViewerAck();
            if (object.sessionId != null)
                message.sessionId = object.sessionId >>> 0;
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from a RegisterViewerAck message. Also converts values to other types if specified.
         * @function toObject
         * @memberof VRDAVis.RegisterViewerAck
         * @static
         * @param {VRDAVis.RegisterViewerAck} message RegisterViewerAck
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RegisterViewerAck.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.sessionId = 0;
                object.success = false;
                object.message = "";
            }
            if (message.sessionId != null && message.hasOwnProperty("sessionId"))
                object.sessionId = message.sessionId;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this RegisterViewerAck to JSON.
         * @function toJSON
         * @memberof VRDAVis.RegisterViewerAck
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RegisterViewerAck.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RegisterViewerAck
         * @function getTypeUrl
         * @memberof VRDAVis.RegisterViewerAck
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RegisterViewerAck.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/VRDAVis.RegisterViewerAck";
        };

        return RegisterViewerAck;
    })();

    VRDAVis.VolumeData = (function() {

        /**
         * Properties of a VolumeData.
         * @memberof VRDAVis
         * @interface IVolumeData
         * @property {Array.<VRDAVis.IVolumeDataCube>|null} [cubes] VolumeData cubes
         */

        /**
         * Constructs a new VolumeData.
         * @memberof VRDAVis
         * @classdesc Represents a VolumeData.
         * @implements IVolumeData
         * @constructor
         * @param {VRDAVis.IVolumeData=} [properties] Properties to set
         */
        function VolumeData(properties) {
            this.cubes = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VolumeData cubes.
         * @member {Array.<VRDAVis.IVolumeDataCube>} cubes
         * @memberof VRDAVis.VolumeData
         * @instance
         */
        VolumeData.prototype.cubes = $util.emptyArray;

        /**
         * Creates a new VolumeData instance using the specified properties.
         * @function create
         * @memberof VRDAVis.VolumeData
         * @static
         * @param {VRDAVis.IVolumeData=} [properties] Properties to set
         * @returns {VRDAVis.VolumeData} VolumeData instance
         */
        VolumeData.create = function create(properties) {
            return new VolumeData(properties);
        };

        /**
         * Encodes the specified VolumeData message. Does not implicitly {@link VRDAVis.VolumeData.verify|verify} messages.
         * @function encode
         * @memberof VRDAVis.VolumeData
         * @static
         * @param {VRDAVis.IVolumeData} message VolumeData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VolumeData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cubes != null && message.cubes.length)
                for (let i = 0; i < message.cubes.length; ++i)
                    $root.VRDAVis.VolumeDataCube.encode(message.cubes[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified VolumeData message, length delimited. Does not implicitly {@link VRDAVis.VolumeData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof VRDAVis.VolumeData
         * @static
         * @param {VRDAVis.IVolumeData} message VolumeData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VolumeData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VolumeData message from the specified reader or buffer.
         * @function decode
         * @memberof VRDAVis.VolumeData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {VRDAVis.VolumeData} VolumeData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VolumeData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.VRDAVis.VolumeData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.cubes && message.cubes.length))
                            message.cubes = [];
                        message.cubes.push($root.VRDAVis.VolumeDataCube.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a VolumeData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof VRDAVis.VolumeData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {VRDAVis.VolumeData} VolumeData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VolumeData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VolumeData message.
         * @function verify
         * @memberof VRDAVis.VolumeData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VolumeData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cubes != null && message.hasOwnProperty("cubes")) {
                if (!Array.isArray(message.cubes))
                    return "cubes: array expected";
                for (let i = 0; i < message.cubes.length; ++i) {
                    let error = $root.VRDAVis.VolumeDataCube.verify(message.cubes[i]);
                    if (error)
                        return "cubes." + error;
                }
            }
            return null;
        };

        /**
         * Creates a VolumeData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof VRDAVis.VolumeData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {VRDAVis.VolumeData} VolumeData
         */
        VolumeData.fromObject = function fromObject(object) {
            if (object instanceof $root.VRDAVis.VolumeData)
                return object;
            let message = new $root.VRDAVis.VolumeData();
            if (object.cubes) {
                if (!Array.isArray(object.cubes))
                    throw TypeError(".VRDAVis.VolumeData.cubes: array expected");
                message.cubes = [];
                for (let i = 0; i < object.cubes.length; ++i) {
                    if (typeof object.cubes[i] !== "object")
                        throw TypeError(".VRDAVis.VolumeData.cubes: object expected");
                    message.cubes[i] = $root.VRDAVis.VolumeDataCube.fromObject(object.cubes[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a VolumeData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof VRDAVis.VolumeData
         * @static
         * @param {VRDAVis.VolumeData} message VolumeData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VolumeData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.cubes = [];
            if (message.cubes && message.cubes.length) {
                object.cubes = [];
                for (let j = 0; j < message.cubes.length; ++j)
                    object.cubes[j] = $root.VRDAVis.VolumeDataCube.toObject(message.cubes[j], options);
            }
            return object;
        };

        /**
         * Converts this VolumeData to JSON.
         * @function toJSON
         * @memberof VRDAVis.VolumeData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VolumeData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for VolumeData
         * @function getTypeUrl
         * @memberof VRDAVis.VolumeData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        VolumeData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/VRDAVis.VolumeData";
        };

        return VolumeData;
    })();

    return VRDAVis;
})();

export { $root as default };
