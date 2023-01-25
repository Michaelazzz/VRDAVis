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

    VRDAVis.Cubelet = (function() {

        /**
         * Properties of a Cubelet.
         * @memberof VRDAVis
         * @interface ICubelet
         * @property {number|null} [layer] Cubelet layer
         * @property {number|null} [x] Cubelet x
         * @property {number|null} [y] Cubelet y
         * @property {number|null} [z] Cubelet z
         * @property {number|null} [width] Cubelet width
         * @property {number|null} [height] Cubelet height
         * @property {number|null} [length] Cubelet length
         * @property {Uint8Array|null} [volumeData] Cubelet volumeData
         * @property {Uint8Array|null} [nanEncodings] Cubelet nanEncodings
         * @property {number|null} [mip] Cubelet mip
         */

        /**
         * Constructs a new Cubelet.
         * @memberof VRDAVis
         * @classdesc Represents a Cubelet.
         * @implements ICubelet
         * @constructor
         * @param {VRDAVis.ICubelet=} [properties] Properties to set
         */
        function Cubelet(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Cubelet layer.
         * @member {number} layer
         * @memberof VRDAVis.Cubelet
         * @instance
         */
        Cubelet.prototype.layer = 0;

        /**
         * Cubelet x.
         * @member {number} x
         * @memberof VRDAVis.Cubelet
         * @instance
         */
        Cubelet.prototype.x = 0;

        /**
         * Cubelet y.
         * @member {number} y
         * @memberof VRDAVis.Cubelet
         * @instance
         */
        Cubelet.prototype.y = 0;

        /**
         * Cubelet z.
         * @member {number} z
         * @memberof VRDAVis.Cubelet
         * @instance
         */
        Cubelet.prototype.z = 0;

        /**
         * Cubelet width.
         * @member {number} width
         * @memberof VRDAVis.Cubelet
         * @instance
         */
        Cubelet.prototype.width = 0;

        /**
         * Cubelet height.
         * @member {number} height
         * @memberof VRDAVis.Cubelet
         * @instance
         */
        Cubelet.prototype.height = 0;

        /**
         * Cubelet length.
         * @member {number} length
         * @memberof VRDAVis.Cubelet
         * @instance
         */
        Cubelet.prototype.length = 0;

        /**
         * Cubelet volumeData.
         * @member {Uint8Array} volumeData
         * @memberof VRDAVis.Cubelet
         * @instance
         */
        Cubelet.prototype.volumeData = $util.newBuffer([]);

        /**
         * Cubelet nanEncodings.
         * @member {Uint8Array} nanEncodings
         * @memberof VRDAVis.Cubelet
         * @instance
         */
        Cubelet.prototype.nanEncodings = $util.newBuffer([]);

        /**
         * Cubelet mip.
         * @member {number} mip
         * @memberof VRDAVis.Cubelet
         * @instance
         */
        Cubelet.prototype.mip = 0;

        /**
         * Creates a new Cubelet instance using the specified properties.
         * @function create
         * @memberof VRDAVis.Cubelet
         * @static
         * @param {VRDAVis.ICubelet=} [properties] Properties to set
         * @returns {VRDAVis.Cubelet} Cubelet instance
         */
        Cubelet.create = function create(properties) {
            return new Cubelet(properties);
        };

        /**
         * Encodes the specified Cubelet message. Does not implicitly {@link VRDAVis.Cubelet.verify|verify} messages.
         * @function encode
         * @memberof VRDAVis.Cubelet
         * @static
         * @param {VRDAVis.ICubelet} message Cubelet message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Cubelet.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.layer != null && Object.hasOwnProperty.call(message, "layer"))
                writer.uint32(/* id 1, wireType 5 =*/13).sfixed32(message.layer);
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 2, wireType 5 =*/21).sfixed32(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 3, wireType 5 =*/29).sfixed32(message.y);
            if (message.z != null && Object.hasOwnProperty.call(message, "z"))
                writer.uint32(/* id 4, wireType 5 =*/37).sfixed32(message.z);
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 5, wireType 5 =*/45).sfixed32(message.width);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 6, wireType 5 =*/53).sfixed32(message.height);
            if (message.length != null && Object.hasOwnProperty.call(message, "length"))
                writer.uint32(/* id 7, wireType 5 =*/61).sfixed32(message.length);
            if (message.volumeData != null && Object.hasOwnProperty.call(message, "volumeData"))
                writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.volumeData);
            if (message.nanEncodings != null && Object.hasOwnProperty.call(message, "nanEncodings"))
                writer.uint32(/* id 9, wireType 2 =*/74).bytes(message.nanEncodings);
            if (message.mip != null && Object.hasOwnProperty.call(message, "mip"))
                writer.uint32(/* id 10, wireType 5 =*/85).sfixed32(message.mip);
            return writer;
        };

        /**
         * Encodes the specified Cubelet message, length delimited. Does not implicitly {@link VRDAVis.Cubelet.verify|verify} messages.
         * @function encodeDelimited
         * @memberof VRDAVis.Cubelet
         * @static
         * @param {VRDAVis.ICubelet} message Cubelet message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Cubelet.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Cubelet message from the specified reader or buffer.
         * @function decode
         * @memberof VRDAVis.Cubelet
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {VRDAVis.Cubelet} Cubelet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Cubelet.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.VRDAVis.Cubelet();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.layer = reader.sfixed32();
                    break;
                case 2:
                    message.x = reader.sfixed32();
                    break;
                case 3:
                    message.y = reader.sfixed32();
                    break;
                case 4:
                    message.z = reader.sfixed32();
                    break;
                case 5:
                    message.width = reader.sfixed32();
                    break;
                case 6:
                    message.height = reader.sfixed32();
                    break;
                case 7:
                    message.length = reader.sfixed32();
                    break;
                case 8:
                    message.volumeData = reader.bytes();
                    break;
                case 9:
                    message.nanEncodings = reader.bytes();
                    break;
                case 10:
                    message.mip = reader.sfixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Cubelet message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof VRDAVis.Cubelet
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {VRDAVis.Cubelet} Cubelet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Cubelet.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Cubelet message.
         * @function verify
         * @memberof VRDAVis.Cubelet
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Cubelet.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.layer != null && message.hasOwnProperty("layer"))
                if (!$util.isInteger(message.layer))
                    return "layer: integer expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (!$util.isInteger(message.x))
                    return "x: integer expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (!$util.isInteger(message.y))
                    return "y: integer expected";
            if (message.z != null && message.hasOwnProperty("z"))
                if (!$util.isInteger(message.z))
                    return "z: integer expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.length != null && message.hasOwnProperty("length"))
                if (!$util.isInteger(message.length))
                    return "length: integer expected";
            if (message.volumeData != null && message.hasOwnProperty("volumeData"))
                if (!(message.volumeData && typeof message.volumeData.length === "number" || $util.isString(message.volumeData)))
                    return "volumeData: buffer expected";
            if (message.nanEncodings != null && message.hasOwnProperty("nanEncodings"))
                if (!(message.nanEncodings && typeof message.nanEncodings.length === "number" || $util.isString(message.nanEncodings)))
                    return "nanEncodings: buffer expected";
            if (message.mip != null && message.hasOwnProperty("mip"))
                if (!$util.isInteger(message.mip))
                    return "mip: integer expected";
            return null;
        };

        /**
         * Creates a Cubelet message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof VRDAVis.Cubelet
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {VRDAVis.Cubelet} Cubelet
         */
        Cubelet.fromObject = function fromObject(object) {
            if (object instanceof $root.VRDAVis.Cubelet)
                return object;
            let message = new $root.VRDAVis.Cubelet();
            if (object.layer != null)
                message.layer = object.layer | 0;
            if (object.x != null)
                message.x = object.x | 0;
            if (object.y != null)
                message.y = object.y | 0;
            if (object.z != null)
                message.z = object.z | 0;
            if (object.width != null)
                message.width = object.width | 0;
            if (object.height != null)
                message.height = object.height | 0;
            if (object.length != null)
                message.length = object.length | 0;
            if (object.volumeData != null)
                if (typeof object.volumeData === "string")
                    $util.base64.decode(object.volumeData, message.volumeData = $util.newBuffer($util.base64.length(object.volumeData)), 0);
                else if (object.volumeData.length)
                    message.volumeData = object.volumeData;
            if (object.nanEncodings != null)
                if (typeof object.nanEncodings === "string")
                    $util.base64.decode(object.nanEncodings, message.nanEncodings = $util.newBuffer($util.base64.length(object.nanEncodings)), 0);
                else if (object.nanEncodings.length)
                    message.nanEncodings = object.nanEncodings;
            if (object.mip != null)
                message.mip = object.mip | 0;
            return message;
        };

        /**
         * Creates a plain object from a Cubelet message. Also converts values to other types if specified.
         * @function toObject
         * @memberof VRDAVis.Cubelet
         * @static
         * @param {VRDAVis.Cubelet} message Cubelet
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Cubelet.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.layer = 0;
                object.x = 0;
                object.y = 0;
                object.z = 0;
                object.width = 0;
                object.height = 0;
                object.length = 0;
                if (options.bytes === String)
                    object.volumeData = "";
                else {
                    object.volumeData = [];
                    if (options.bytes !== Array)
                        object.volumeData = $util.newBuffer(object.volumeData);
                }
                if (options.bytes === String)
                    object.nanEncodings = "";
                else {
                    object.nanEncodings = [];
                    if (options.bytes !== Array)
                        object.nanEncodings = $util.newBuffer(object.nanEncodings);
                }
                object.mip = 0;
            }
            if (message.layer != null && message.hasOwnProperty("layer"))
                object.layer = message.layer;
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = message.y;
            if (message.z != null && message.hasOwnProperty("z"))
                object.z = message.z;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.length != null && message.hasOwnProperty("length"))
                object.length = message.length;
            if (message.volumeData != null && message.hasOwnProperty("volumeData"))
                object.volumeData = options.bytes === String ? $util.base64.encode(message.volumeData, 0, message.volumeData.length) : options.bytes === Array ? Array.prototype.slice.call(message.volumeData) : message.volumeData;
            if (message.nanEncodings != null && message.hasOwnProperty("nanEncodings"))
                object.nanEncodings = options.bytes === String ? $util.base64.encode(message.nanEncodings, 0, message.nanEncodings.length) : options.bytes === Array ? Array.prototype.slice.call(message.nanEncodings) : message.nanEncodings;
            if (message.mip != null && message.hasOwnProperty("mip"))
                object.mip = message.mip;
            return object;
        };

        /**
         * Converts this Cubelet to JSON.
         * @function toJSON
         * @memberof VRDAVis.Cubelet
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Cubelet.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Cubelet;
    })();

    /**
     * EventType enum.
     * @name VRDAVis.EventType
     * @enum {number}
     * @property {number} EMPTY_EVENT=0 EMPTY_EVENT value
     * @property {number} REGISTER_VIEWER=1 REGISTER_VIEWER value
     * @property {number} REGISTER_VIEWER_ACK=2 REGISTER_VIEWER_ACK value
     * @property {number} CUBE_DATA=3 CUBE_DATA value
     */
    VRDAVis.EventType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "EMPTY_EVENT"] = 0;
        values[valuesById[1] = "REGISTER_VIEWER"] = 1;
        values[valuesById[2] = "REGISTER_VIEWER_ACK"] = 2;
        values[valuesById[3] = "CUBE_DATA"] = 3;
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

    VRDAVis.AddRequiredCubes = (function() {

        /**
         * Properties of an AddRequiredCubes.
         * @memberof VRDAVis
         * @interface IAddRequiredCubes
         * @property {number|null} [fileId] AddRequiredCubes fileId
         * @property {Array.<number>|null} [cubes] AddRequiredCubes cubes
         */

        /**
         * Constructs a new AddRequiredCubes.
         * @memberof VRDAVis
         * @classdesc Represents an AddRequiredCubes.
         * @implements IAddRequiredCubes
         * @constructor
         * @param {VRDAVis.IAddRequiredCubes=} [properties] Properties to set
         */
        function AddRequiredCubes(properties) {
            this.cubes = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AddRequiredCubes fileId.
         * @member {number} fileId
         * @memberof VRDAVis.AddRequiredCubes
         * @instance
         */
        AddRequiredCubes.prototype.fileId = 0;

        /**
         * AddRequiredCubes cubes.
         * @member {Array.<number>} cubes
         * @memberof VRDAVis.AddRequiredCubes
         * @instance
         */
        AddRequiredCubes.prototype.cubes = $util.emptyArray;

        /**
         * Creates a new AddRequiredCubes instance using the specified properties.
         * @function create
         * @memberof VRDAVis.AddRequiredCubes
         * @static
         * @param {VRDAVis.IAddRequiredCubes=} [properties] Properties to set
         * @returns {VRDAVis.AddRequiredCubes} AddRequiredCubes instance
         */
        AddRequiredCubes.create = function create(properties) {
            return new AddRequiredCubes(properties);
        };

        /**
         * Encodes the specified AddRequiredCubes message. Does not implicitly {@link VRDAVis.AddRequiredCubes.verify|verify} messages.
         * @function encode
         * @memberof VRDAVis.AddRequiredCubes
         * @static
         * @param {VRDAVis.IAddRequiredCubes} message AddRequiredCubes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddRequiredCubes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fileId != null && Object.hasOwnProperty.call(message, "fileId"))
                writer.uint32(/* id 1, wireType 5 =*/13).sfixed32(message.fileId);
            if (message.cubes != null && message.cubes.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (let i = 0; i < message.cubes.length; ++i)
                    writer.sfixed32(message.cubes[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified AddRequiredCubes message, length delimited. Does not implicitly {@link VRDAVis.AddRequiredCubes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof VRDAVis.AddRequiredCubes
         * @static
         * @param {VRDAVis.IAddRequiredCubes} message AddRequiredCubes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddRequiredCubes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AddRequiredCubes message from the specified reader or buffer.
         * @function decode
         * @memberof VRDAVis.AddRequiredCubes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {VRDAVis.AddRequiredCubes} AddRequiredCubes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddRequiredCubes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.VRDAVis.AddRequiredCubes();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.fileId = reader.sfixed32();
                    break;
                case 2:
                    if (!(message.cubes && message.cubes.length))
                        message.cubes = [];
                    if ((tag & 7) === 2) {
                        let end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.cubes.push(reader.sfixed32());
                    } else
                        message.cubes.push(reader.sfixed32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AddRequiredCubes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof VRDAVis.AddRequiredCubes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {VRDAVis.AddRequiredCubes} AddRequiredCubes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddRequiredCubes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AddRequiredCubes message.
         * @function verify
         * @memberof VRDAVis.AddRequiredCubes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AddRequiredCubes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.fileId != null && message.hasOwnProperty("fileId"))
                if (!$util.isInteger(message.fileId))
                    return "fileId: integer expected";
            if (message.cubes != null && message.hasOwnProperty("cubes")) {
                if (!Array.isArray(message.cubes))
                    return "cubes: array expected";
                for (let i = 0; i < message.cubes.length; ++i)
                    if (!$util.isInteger(message.cubes[i]))
                        return "cubes: integer[] expected";
            }
            return null;
        };

        /**
         * Creates an AddRequiredCubes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof VRDAVis.AddRequiredCubes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {VRDAVis.AddRequiredCubes} AddRequiredCubes
         */
        AddRequiredCubes.fromObject = function fromObject(object) {
            if (object instanceof $root.VRDAVis.AddRequiredCubes)
                return object;
            let message = new $root.VRDAVis.AddRequiredCubes();
            if (object.fileId != null)
                message.fileId = object.fileId | 0;
            if (object.cubes) {
                if (!Array.isArray(object.cubes))
                    throw TypeError(".VRDAVis.AddRequiredCubes.cubes: array expected");
                message.cubes = [];
                for (let i = 0; i < object.cubes.length; ++i)
                    message.cubes[i] = object.cubes[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from an AddRequiredCubes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof VRDAVis.AddRequiredCubes
         * @static
         * @param {VRDAVis.AddRequiredCubes} message AddRequiredCubes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AddRequiredCubes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.cubes = [];
            if (options.defaults)
                object.fileId = 0;
            if (message.fileId != null && message.hasOwnProperty("fileId"))
                object.fileId = message.fileId;
            if (message.cubes && message.cubes.length) {
                object.cubes = [];
                for (let j = 0; j < message.cubes.length; ++j)
                    object.cubes[j] = message.cubes[j];
            }
            return object;
        };

        /**
         * Converts this AddRequiredCubes to JSON.
         * @function toJSON
         * @memberof VRDAVis.AddRequiredCubes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AddRequiredCubes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AddRequiredCubes;
    })();

    VRDAVis.RemoveRequiredTiles = (function() {

        /**
         * Properties of a RemoveRequiredTiles.
         * @memberof VRDAVis
         * @interface IRemoveRequiredTiles
         * @property {number|null} [fileId] RemoveRequiredTiles fileId
         * @property {Array.<number>|null} [cubes] RemoveRequiredTiles cubes
         */

        /**
         * Constructs a new RemoveRequiredTiles.
         * @memberof VRDAVis
         * @classdesc Represents a RemoveRequiredTiles.
         * @implements IRemoveRequiredTiles
         * @constructor
         * @param {VRDAVis.IRemoveRequiredTiles=} [properties] Properties to set
         */
        function RemoveRequiredTiles(properties) {
            this.cubes = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RemoveRequiredTiles fileId.
         * @member {number} fileId
         * @memberof VRDAVis.RemoveRequiredTiles
         * @instance
         */
        RemoveRequiredTiles.prototype.fileId = 0;

        /**
         * RemoveRequiredTiles cubes.
         * @member {Array.<number>} cubes
         * @memberof VRDAVis.RemoveRequiredTiles
         * @instance
         */
        RemoveRequiredTiles.prototype.cubes = $util.emptyArray;

        /**
         * Creates a new RemoveRequiredTiles instance using the specified properties.
         * @function create
         * @memberof VRDAVis.RemoveRequiredTiles
         * @static
         * @param {VRDAVis.IRemoveRequiredTiles=} [properties] Properties to set
         * @returns {VRDAVis.RemoveRequiredTiles} RemoveRequiredTiles instance
         */
        RemoveRequiredTiles.create = function create(properties) {
            return new RemoveRequiredTiles(properties);
        };

        /**
         * Encodes the specified RemoveRequiredTiles message. Does not implicitly {@link VRDAVis.RemoveRequiredTiles.verify|verify} messages.
         * @function encode
         * @memberof VRDAVis.RemoveRequiredTiles
         * @static
         * @param {VRDAVis.IRemoveRequiredTiles} message RemoveRequiredTiles message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RemoveRequiredTiles.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fileId != null && Object.hasOwnProperty.call(message, "fileId"))
                writer.uint32(/* id 1, wireType 5 =*/13).sfixed32(message.fileId);
            if (message.cubes != null && message.cubes.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (let i = 0; i < message.cubes.length; ++i)
                    writer.sfixed32(message.cubes[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified RemoveRequiredTiles message, length delimited. Does not implicitly {@link VRDAVis.RemoveRequiredTiles.verify|verify} messages.
         * @function encodeDelimited
         * @memberof VRDAVis.RemoveRequiredTiles
         * @static
         * @param {VRDAVis.IRemoveRequiredTiles} message RemoveRequiredTiles message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RemoveRequiredTiles.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RemoveRequiredTiles message from the specified reader or buffer.
         * @function decode
         * @memberof VRDAVis.RemoveRequiredTiles
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {VRDAVis.RemoveRequiredTiles} RemoveRequiredTiles
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RemoveRequiredTiles.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.VRDAVis.RemoveRequiredTiles();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.fileId = reader.sfixed32();
                    break;
                case 2:
                    if (!(message.cubes && message.cubes.length))
                        message.cubes = [];
                    if ((tag & 7) === 2) {
                        let end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.cubes.push(reader.sfixed32());
                    } else
                        message.cubes.push(reader.sfixed32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RemoveRequiredTiles message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof VRDAVis.RemoveRequiredTiles
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {VRDAVis.RemoveRequiredTiles} RemoveRequiredTiles
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RemoveRequiredTiles.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RemoveRequiredTiles message.
         * @function verify
         * @memberof VRDAVis.RemoveRequiredTiles
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RemoveRequiredTiles.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.fileId != null && message.hasOwnProperty("fileId"))
                if (!$util.isInteger(message.fileId))
                    return "fileId: integer expected";
            if (message.cubes != null && message.hasOwnProperty("cubes")) {
                if (!Array.isArray(message.cubes))
                    return "cubes: array expected";
                for (let i = 0; i < message.cubes.length; ++i)
                    if (!$util.isInteger(message.cubes[i]))
                        return "cubes: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a RemoveRequiredTiles message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof VRDAVis.RemoveRequiredTiles
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {VRDAVis.RemoveRequiredTiles} RemoveRequiredTiles
         */
        RemoveRequiredTiles.fromObject = function fromObject(object) {
            if (object instanceof $root.VRDAVis.RemoveRequiredTiles)
                return object;
            let message = new $root.VRDAVis.RemoveRequiredTiles();
            if (object.fileId != null)
                message.fileId = object.fileId | 0;
            if (object.cubes) {
                if (!Array.isArray(object.cubes))
                    throw TypeError(".VRDAVis.RemoveRequiredTiles.cubes: array expected");
                message.cubes = [];
                for (let i = 0; i < object.cubes.length; ++i)
                    message.cubes[i] = object.cubes[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a RemoveRequiredTiles message. Also converts values to other types if specified.
         * @function toObject
         * @memberof VRDAVis.RemoveRequiredTiles
         * @static
         * @param {VRDAVis.RemoveRequiredTiles} message RemoveRequiredTiles
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RemoveRequiredTiles.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.cubes = [];
            if (options.defaults)
                object.fileId = 0;
            if (message.fileId != null && message.hasOwnProperty("fileId"))
                object.fileId = message.fileId;
            if (message.cubes && message.cubes.length) {
                object.cubes = [];
                for (let j = 0; j < message.cubes.length; ++j)
                    object.cubes[j] = message.cubes[j];
            }
            return object;
        };

        /**
         * Converts this RemoveRequiredTiles to JSON.
         * @function toJSON
         * @memberof VRDAVis.RemoveRequiredTiles
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RemoveRequiredTiles.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RemoveRequiredTiles;
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
                case 1:
                    message.sessionId = reader.fixed32();
                    break;
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
                case 1:
                    message.sessionId = reader.fixed32();
                    break;
                case 2:
                    message.success = reader.bool();
                    break;
                case 3:
                    message.message = reader.string();
                    break;
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

        return RegisterViewerAck;
    })();

    VRDAVis.CubeData = (function() {

        /**
         * Properties of a CubeData.
         * @memberof VRDAVis
         * @interface ICubeData
         * @property {number|null} [layer] CubeData layer
         * @property {number|null} [x] CubeData x
         * @property {number|null} [y] CubeData y
         * @property {number|null} [z] CubeData z
         * @property {number|null} [width] CubeData width
         * @property {number|null} [height] CubeData height
         * @property {number|null} [length] CubeData length
         * @property {Uint8Array|null} [volumeData] CubeData volumeData
         * @property {Uint8Array|null} [nanEncodings] CubeData nanEncodings
         * @property {number|null} [mip] CubeData mip
         */

        /**
         * Constructs a new CubeData.
         * @memberof VRDAVis
         * @classdesc Represents a CubeData.
         * @implements ICubeData
         * @constructor
         * @param {VRDAVis.ICubeData=} [properties] Properties to set
         */
        function CubeData(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CubeData layer.
         * @member {number} layer
         * @memberof VRDAVis.CubeData
         * @instance
         */
        CubeData.prototype.layer = 0;

        /**
         * CubeData x.
         * @member {number} x
         * @memberof VRDAVis.CubeData
         * @instance
         */
        CubeData.prototype.x = 0;

        /**
         * CubeData y.
         * @member {number} y
         * @memberof VRDAVis.CubeData
         * @instance
         */
        CubeData.prototype.y = 0;

        /**
         * CubeData z.
         * @member {number} z
         * @memberof VRDAVis.CubeData
         * @instance
         */
        CubeData.prototype.z = 0;

        /**
         * CubeData width.
         * @member {number} width
         * @memberof VRDAVis.CubeData
         * @instance
         */
        CubeData.prototype.width = 0;

        /**
         * CubeData height.
         * @member {number} height
         * @memberof VRDAVis.CubeData
         * @instance
         */
        CubeData.prototype.height = 0;

        /**
         * CubeData length.
         * @member {number} length
         * @memberof VRDAVis.CubeData
         * @instance
         */
        CubeData.prototype.length = 0;

        /**
         * CubeData volumeData.
         * @member {Uint8Array} volumeData
         * @memberof VRDAVis.CubeData
         * @instance
         */
        CubeData.prototype.volumeData = $util.newBuffer([]);

        /**
         * CubeData nanEncodings.
         * @member {Uint8Array} nanEncodings
         * @memberof VRDAVis.CubeData
         * @instance
         */
        CubeData.prototype.nanEncodings = $util.newBuffer([]);

        /**
         * CubeData mip.
         * @member {number} mip
         * @memberof VRDAVis.CubeData
         * @instance
         */
        CubeData.prototype.mip = 0;

        /**
         * Creates a new CubeData instance using the specified properties.
         * @function create
         * @memberof VRDAVis.CubeData
         * @static
         * @param {VRDAVis.ICubeData=} [properties] Properties to set
         * @returns {VRDAVis.CubeData} CubeData instance
         */
        CubeData.create = function create(properties) {
            return new CubeData(properties);
        };

        /**
         * Encodes the specified CubeData message. Does not implicitly {@link VRDAVis.CubeData.verify|verify} messages.
         * @function encode
         * @memberof VRDAVis.CubeData
         * @static
         * @param {VRDAVis.ICubeData} message CubeData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CubeData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.layer != null && Object.hasOwnProperty.call(message, "layer"))
                writer.uint32(/* id 1, wireType 5 =*/13).sfixed32(message.layer);
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 2, wireType 5 =*/21).sfixed32(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 3, wireType 5 =*/29).sfixed32(message.y);
            if (message.z != null && Object.hasOwnProperty.call(message, "z"))
                writer.uint32(/* id 4, wireType 5 =*/37).sfixed32(message.z);
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 5, wireType 5 =*/45).sfixed32(message.width);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 6, wireType 5 =*/53).sfixed32(message.height);
            if (message.length != null && Object.hasOwnProperty.call(message, "length"))
                writer.uint32(/* id 7, wireType 5 =*/61).sfixed32(message.length);
            if (message.volumeData != null && Object.hasOwnProperty.call(message, "volumeData"))
                writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.volumeData);
            if (message.nanEncodings != null && Object.hasOwnProperty.call(message, "nanEncodings"))
                writer.uint32(/* id 9, wireType 2 =*/74).bytes(message.nanEncodings);
            if (message.mip != null && Object.hasOwnProperty.call(message, "mip"))
                writer.uint32(/* id 10, wireType 5 =*/85).sfixed32(message.mip);
            return writer;
        };

        /**
         * Encodes the specified CubeData message, length delimited. Does not implicitly {@link VRDAVis.CubeData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof VRDAVis.CubeData
         * @static
         * @param {VRDAVis.ICubeData} message CubeData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CubeData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CubeData message from the specified reader or buffer.
         * @function decode
         * @memberof VRDAVis.CubeData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {VRDAVis.CubeData} CubeData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CubeData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.VRDAVis.CubeData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.layer = reader.sfixed32();
                    break;
                case 2:
                    message.x = reader.sfixed32();
                    break;
                case 3:
                    message.y = reader.sfixed32();
                    break;
                case 4:
                    message.z = reader.sfixed32();
                    break;
                case 5:
                    message.width = reader.sfixed32();
                    break;
                case 6:
                    message.height = reader.sfixed32();
                    break;
                case 7:
                    message.length = reader.sfixed32();
                    break;
                case 8:
                    message.volumeData = reader.bytes();
                    break;
                case 9:
                    message.nanEncodings = reader.bytes();
                    break;
                case 10:
                    message.mip = reader.sfixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CubeData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof VRDAVis.CubeData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {VRDAVis.CubeData} CubeData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CubeData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CubeData message.
         * @function verify
         * @memberof VRDAVis.CubeData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CubeData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.layer != null && message.hasOwnProperty("layer"))
                if (!$util.isInteger(message.layer))
                    return "layer: integer expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (!$util.isInteger(message.x))
                    return "x: integer expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (!$util.isInteger(message.y))
                    return "y: integer expected";
            if (message.z != null && message.hasOwnProperty("z"))
                if (!$util.isInteger(message.z))
                    return "z: integer expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.length != null && message.hasOwnProperty("length"))
                if (!$util.isInteger(message.length))
                    return "length: integer expected";
            if (message.volumeData != null && message.hasOwnProperty("volumeData"))
                if (!(message.volumeData && typeof message.volumeData.length === "number" || $util.isString(message.volumeData)))
                    return "volumeData: buffer expected";
            if (message.nanEncodings != null && message.hasOwnProperty("nanEncodings"))
                if (!(message.nanEncodings && typeof message.nanEncodings.length === "number" || $util.isString(message.nanEncodings)))
                    return "nanEncodings: buffer expected";
            if (message.mip != null && message.hasOwnProperty("mip"))
                if (!$util.isInteger(message.mip))
                    return "mip: integer expected";
            return null;
        };

        /**
         * Creates a CubeData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof VRDAVis.CubeData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {VRDAVis.CubeData} CubeData
         */
        CubeData.fromObject = function fromObject(object) {
            if (object instanceof $root.VRDAVis.CubeData)
                return object;
            let message = new $root.VRDAVis.CubeData();
            if (object.layer != null)
                message.layer = object.layer | 0;
            if (object.x != null)
                message.x = object.x | 0;
            if (object.y != null)
                message.y = object.y | 0;
            if (object.z != null)
                message.z = object.z | 0;
            if (object.width != null)
                message.width = object.width | 0;
            if (object.height != null)
                message.height = object.height | 0;
            if (object.length != null)
                message.length = object.length | 0;
            if (object.volumeData != null)
                if (typeof object.volumeData === "string")
                    $util.base64.decode(object.volumeData, message.volumeData = $util.newBuffer($util.base64.length(object.volumeData)), 0);
                else if (object.volumeData.length)
                    message.volumeData = object.volumeData;
            if (object.nanEncodings != null)
                if (typeof object.nanEncodings === "string")
                    $util.base64.decode(object.nanEncodings, message.nanEncodings = $util.newBuffer($util.base64.length(object.nanEncodings)), 0);
                else if (object.nanEncodings.length)
                    message.nanEncodings = object.nanEncodings;
            if (object.mip != null)
                message.mip = object.mip | 0;
            return message;
        };

        /**
         * Creates a plain object from a CubeData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof VRDAVis.CubeData
         * @static
         * @param {VRDAVis.CubeData} message CubeData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CubeData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.layer = 0;
                object.x = 0;
                object.y = 0;
                object.z = 0;
                object.width = 0;
                object.height = 0;
                object.length = 0;
                if (options.bytes === String)
                    object.volumeData = "";
                else {
                    object.volumeData = [];
                    if (options.bytes !== Array)
                        object.volumeData = $util.newBuffer(object.volumeData);
                }
                if (options.bytes === String)
                    object.nanEncodings = "";
                else {
                    object.nanEncodings = [];
                    if (options.bytes !== Array)
                        object.nanEncodings = $util.newBuffer(object.nanEncodings);
                }
                object.mip = 0;
            }
            if (message.layer != null && message.hasOwnProperty("layer"))
                object.layer = message.layer;
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = message.y;
            if (message.z != null && message.hasOwnProperty("z"))
                object.z = message.z;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.length != null && message.hasOwnProperty("length"))
                object.length = message.length;
            if (message.volumeData != null && message.hasOwnProperty("volumeData"))
                object.volumeData = options.bytes === String ? $util.base64.encode(message.volumeData, 0, message.volumeData.length) : options.bytes === Array ? Array.prototype.slice.call(message.volumeData) : message.volumeData;
            if (message.nanEncodings != null && message.hasOwnProperty("nanEncodings"))
                object.nanEncodings = options.bytes === String ? $util.base64.encode(message.nanEncodings, 0, message.nanEncodings.length) : options.bytes === Array ? Array.prototype.slice.call(message.nanEncodings) : message.nanEncodings;
            if (message.mip != null && message.hasOwnProperty("mip"))
                object.mip = message.mip;
            return object;
        };

        /**
         * Converts this CubeData to JSON.
         * @function toJSON
         * @memberof VRDAVis.CubeData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CubeData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CubeData;
    })();

    return VRDAVis;
})();

export { $root as default };
