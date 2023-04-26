/*
 * Version 1.0
 *
 * Copyright 2021 Oleg Nemanov <lego12239@yandex.ru>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * https://github.com/lego12239/_fmt.js
 */
/* A very simple sprintf-like function.
 * For using in libraries(by copy-paste) where adding of
 * external dependencies(like sprintf.js) isn't welcome.
 * Accepts only:
 * - %, s, d and f as a conversion specifier
 * - "-", "0", " ", "+" as flags
 * - width and precision
 */
_fmt = function (fstr)
{
	var args = arguments;
	var i = 0;

	return fstr.replace(/%([-#0 +]+)?([1-9][0-9]*)?(\.[0-9]*)?([%sdf])/g, function (m, flags, width, precision, conv) {
		var ret, v, n, off, sign = 0, f = {zero: false, rightpad: false, "#": false,
		  space: false, sign_always: false};
		var pad = " ", sign = "";

		if (flags != null) {
			if (flags.indexOf("0") != -1)
				f.zero = true;
			if (flags.indexOf("-") != -1) {
				f.rightpad = true;
				f.zero = false;
			}
			if (flags.indexOf(" ") != -1)
				f.space = true;
			if (flags.indexOf("+") != -1) {
				f.sign_always = true;
				f.space = false;
			}
		}
		if (f.zero)
			pad = "0";
		if (f.space)
			sign = " ";
		else if (f.sign_always)
			sign = "+";

		width = Number(width);

		if (precision == ".")
			precision = 0;
		else if (precision != null)
			precision = Number(precision.substring(1));

		switch (conv) {
		case '%':
			return "%";
		case 's':
			ret = String(args[++i]);
			if ((precision != null) && (ret.length > precision))
				ret = ret.substring(0, precision);
			break;
		case 'd':
			if (precision != null)
				pad = " ";

			v = parseInt(args[++i]);
			/* A special case. */
			if ((v == 0) && (precision == 0)) {
				ret = "";
				break;
			}
			if (v < 0) {
				sign = "-";
				v = 0 - v;
			}
			ret = v.toString();
			if (precision != null) {
				if (ret.length < precision)
					ret = "0".repeat(precision - ret.length) + ret;
				ret = sign + ret;
				sign = "";
			}
			width -= sign.length;
			break;
		case 'f':
			if (precision == null)
				precision = 6;

			v = parseFloat(args[++i]);
			if (v < 0) {
				sign = "-";
				v = 0 - v;
			}
			ret = v.toFixed(precision);
			if (pad != "0") {
				ret = sign + ret;
				sign = "";
			}
			width -= sign.length;
			break;
		default:
			throw("_fmt: unknown conversion specifier: " + conv);
		}
		if (ret.length < width)
			if (f.rightpad)
				ret += pad.repeat(width - ret.length);
			else
				ret = pad.repeat(width - ret.length) + ret;
		ret = sign + ret;
		return ret;
	});
}


