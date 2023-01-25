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
