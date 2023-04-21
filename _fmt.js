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
 * %, s and d as a conversion specifier
 */
_fmt = function (fstr)
{
	var args = arguments;
	var i = 0;

	return fstr.replace(/%([-#0 +]+)?([0-9]+)?(\.[0-9]*)?([%sd])/g, function (m, flags, width, precision, conv) {
		var ret, v, n, sign = 0;
         
		if (width == null)
			width = 0;

		if (precision == ".")
			precision = 0;
		else if (precision != null)
			precision = precision.substring(1);

		switch (conv) {
		case '%':
			ret = "%";
			break;
		case 's':
			ret = String(args[++i]);
			if ((precision != null) && (ret.length > precision))
				ret = ret.substring(0, precision);
			if (ret.length < width)
				ret = " ".repeat(width - ret.length) + ret;
			break;
		case 'd':
			v = Number(args[++i]);
			if (v < 0) {
				sign = 1;
				v = 0 - v;
			}
			ret = v.toString().replace(/\..+$/, "");
			if ((precision != null) && (ret.length < precision))
				ret = "0".repeat(precision - ret.length) + ret;
			if (sign)
				ret = "-" + ret;
			if (ret.length < width)
				ret = " ".repeat(width - ret.length) + ret;
			break;
		default:
			throw("_fmt: unknown conversion specifier: " + conv);
		}
		return ret;
	});
}


