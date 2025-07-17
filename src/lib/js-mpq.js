import Buffer from './buffer.js'
const pako = (()=>{

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  /* eslint-disable space-unary-ops */

  /* Public constants ==========================================================*/
  /* ===========================================================================*/

  //const Z_FILTERED          = 1;
  //const Z_HUFFMAN_ONLY      = 2;
  //const Z_RLE               = 3;
  var Z_FIXED$1 = 4;
  //const Z_DEFAULT_STRATEGY  = 0;

  /* Possible values of the data_type field (though see inflate()) */
  var Z_BINARY = 0;
  var Z_TEXT = 1;
  //const Z_ASCII             = 1; // = Z_TEXT
  var Z_UNKNOWN$1 = 2;

  /*============================================================================*/

  function zero$1(buf) {
    var len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }

  // From zutil.h

  var STORED_BLOCK = 0;
  var STATIC_TREES = 1;
  var DYN_TREES = 2;
  /* The three kinds of block type */

  var MIN_MATCH$1 = 3;
  var MAX_MATCH$1 = 258;
  /* The minimum and maximum match lengths */

  // From deflate.h
  /* ===========================================================================
   * Internal compression state.
   */

  var LENGTH_CODES$1 = 29;
  /* number of length codes, not counting the special END_BLOCK code */

  var LITERALS$1 = 256;
  /* number of literal bytes 0..255 */

  var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
  /* number of Literal or Length codes, including the END_BLOCK code */

  var D_CODES$1 = 30;
  /* number of distance codes */

  var BL_CODES$1 = 19;
  /* number of codes used to transfer the bit lengths */

  var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
  /* maximum heap size */

  var MAX_BITS$1 = 15;
  /* All codes must not exceed MAX_BITS bits */

  var Buf_size = 16;
  /* size of bit buffer in bi_buf */

  /* ===========================================================================
   * Constants
   */

  var MAX_BL_BITS = 7;
  /* Bit length codes must not exceed MAX_BL_BITS bits */

  var END_BLOCK = 256;
  /* end of block literal code */

  var REP_3_6 = 16;
  /* repeat previous bit length 3-6 times (2 bits of repeat count) */

  var REPZ_3_10 = 17;
  /* repeat a zero length 3-10 times  (3 bits of repeat count) */

  var REPZ_11_138 = 18;
  /* repeat a zero length 11-138 times  (7 bits of repeat count) */

  /* eslint-disable comma-spacing,array-bracket-spacing */
  var extra_lbits = /* extra bits for each length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]);
  var extra_dbits = /* extra bits for each distance code */
  new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]);
  var extra_blbits = /* extra bits for each bit length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]);
  var bl_order = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  /* eslint-enable comma-spacing,array-bracket-spacing */

  /* The lengths of the bit length codes are sent in order of decreasing
   * probability, to avoid transmitting the lengths for unused bit length codes.
   */

  /* ===========================================================================
   * Local data. These are initialized only once.
   */

  // We pre-fill arrays with 0 to avoid uninitialized gaps

  var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

  // !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
  var static_ltree = new Array((L_CODES$1 + 2) * 2);
  zero$1(static_ltree);
  /* The static literal tree. Since the bit lengths are imposed, there is no
   * need for the L_CODES extra codes used during heap construction. However
   * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
   * below).
   */

  var static_dtree = new Array(D_CODES$1 * 2);
  zero$1(static_dtree);
  /* The static distance tree. (Actually a trivial tree since all codes use
   * 5 bits.)
   */

  var _dist_code = new Array(DIST_CODE_LEN);
  zero$1(_dist_code);
  /* Distance codes. The first 256 values correspond to the distances
   * 3 .. 258, the last 256 values correspond to the top 8 bits of
   * the 15 bit distances.
   */

  var _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
  zero$1(_length_code);
  /* length code for each normalized match length (0 == MIN_MATCH) */

  var base_length = new Array(LENGTH_CODES$1);
  zero$1(base_length);
  /* First normalized length for each code (0 = MIN_MATCH) */

  var base_dist = new Array(D_CODES$1);
  zero$1(base_dist);
  /* First normalized distance for each code (0 = distance of 1) */

  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree; /* static tree or NULL */
    this.extra_bits = extra_bits; /* extra bits for each code or NULL */
    this.extra_base = extra_base; /* base index for extra_bits */
    this.elems = elems; /* max number of elements in the tree */
    this.max_length = max_length; /* max bit length for the codes */

    // show if `static_tree` has data or dummy - needed for monomorphic objects
    this.has_stree = static_tree && static_tree.length;
  }
  var static_l_desc;
  var static_d_desc;
  var static_bl_desc;
  function TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree; /* the dynamic tree */
    this.max_code = 0; /* largest code with non zero frequency */
    this.stat_desc = stat_desc; /* the corresponding static tree */
  }

  var d_code = function d_code(dist) {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  };

  /* ===========================================================================
   * Output a short LSB first on the stream.
   * IN assertion: there is enough room in pendingBuf.
   */
  var put_short = function put_short(s, w) {
    //    put_byte(s, (uch)((w) & 0xff));
    //    put_byte(s, (uch)((ush)(w) >> 8));
    s.pending_buf[s.pending++] = w & 0xff;
    s.pending_buf[s.pending++] = w >>> 8 & 0xff;
  };

  /* ===========================================================================
   * Send a value on a given number of bits.
   * IN assertion: length <= 16 and value fits in length bits.
   */
  var send_bits = function send_bits(s, value, length) {
    if (s.bi_valid > Buf_size - length) {
      s.bi_buf |= value << s.bi_valid & 0xffff;
      put_short(s, s.bi_buf);
      s.bi_buf = value >> Buf_size - s.bi_valid;
      s.bi_valid += length - Buf_size;
    } else {
      s.bi_buf |= value << s.bi_valid & 0xffff;
      s.bi_valid += length;
    }
  };
  var send_code = function send_code(s, c, tree) {
    send_bits(s, tree[c * 2] /*.Code*/, tree[c * 2 + 1] /*.Len*/);
  };

  /* ===========================================================================
   * Reverse the first len bits of a code, using straightforward code (a faster
   * method would use a table)
   * IN assertion: 1 <= len <= 15
   */
  var bi_reverse = function bi_reverse(code, len) {
    var res = 0;
    do {
      res |= code & 1;
      code >>>= 1;
      res <<= 1;
    } while (--len > 0);
    return res >>> 1;
  };

  /* ===========================================================================
   * Flush the bit buffer, keeping at most 7 bits in it.
   */
  var bi_flush = function bi_flush(s) {
    if (s.bi_valid === 16) {
      put_short(s, s.bi_buf);
      s.bi_buf = 0;
      s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
      s.pending_buf[s.pending++] = s.bi_buf & 0xff;
      s.bi_buf >>= 8;
      s.bi_valid -= 8;
    }
  };

  /* ===========================================================================
   * Compute the optimal bit lengths for a tree and update the total bit length
   * for the current block.
   * IN assertion: the fields freq and dad are set, heap[heap_max] and
   *    above are the tree nodes sorted by increasing frequency.
   * OUT assertions: the field len is set to the optimal bit length, the
   *     array bl_count contains the frequencies for each bit length.
   *     The length opt_len is updated; static_len is also updated if stree is
   *     not null.
   */
  var gen_bitlen = function gen_bitlen(s, desc) {
    //    deflate_state *s;
    //    tree_desc *desc;    /* the tree descriptor */

    var tree = desc.dyn_tree;
    var max_code = desc.max_code;
    var stree = desc.stat_desc.static_tree;
    var has_stree = desc.stat_desc.has_stree;
    var extra = desc.stat_desc.extra_bits;
    var base = desc.stat_desc.extra_base;
    var max_length = desc.stat_desc.max_length;
    var h; /* heap index */
    var n, m; /* iterate over the tree elements */
    var bits; /* bit length */
    var xbits; /* extra bits */
    var f; /* frequency */
    var overflow = 0; /* number of elements with bit length too large */

    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      s.bl_count[bits] = 0;
    }

    /* In a first pass, compute the optimal bit lengths (which may
     * overflow in the case of the bit length tree).
     */
    tree[s.heap[s.heap_max] * 2 + 1] /*.Len*/ = 0; /* root of the heap */

    for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
      n = s.heap[h];
      bits = tree[tree[n * 2 + 1] /*.Dad*/ * 2 + 1] /*.Len*/ + 1;
      if (bits > max_length) {
        bits = max_length;
        overflow++;
      }
      tree[n * 2 + 1] /*.Len*/ = bits;
      /* We overwrite tree[n].Dad which is no longer needed */

      if (n > max_code) {
        continue;
      } /* not a leaf node */

      s.bl_count[bits]++;
      xbits = 0;
      if (n >= base) {
        xbits = extra[n - base];
      }
      f = tree[n * 2] /*.Freq*/;
      s.opt_len += f * (bits + xbits);
      if (has_stree) {
        s.static_len += f * (stree[n * 2 + 1] /*.Len*/ + xbits);
      }
    }
    if (overflow === 0) {
      return;
    }

    // Tracev((stderr,"\nbit length overflow\n"));
    /* This happens for example on obj2 and pic of the Calgary corpus */

    /* Find the first bit length which could increase: */
    do {
      bits = max_length - 1;
      while (s.bl_count[bits] === 0) {
        bits--;
      }
      s.bl_count[bits]--; /* move one leaf down the tree */
      s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
      s.bl_count[max_length]--;
      /* The brother of the overflow item also moves one step up,
       * but this does not affect bl_count[max_length]
       */
      overflow -= 2;
    } while (overflow > 0);

    /* Now recompute all bit lengths, scanning in increasing frequency.
     * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
     * lengths instead of fixing only the wrong ones. This idea is taken
     * from 'ar' written by Haruhiko Okumura.)
     */
    for (bits = max_length; bits !== 0; bits--) {
      n = s.bl_count[bits];
      while (n !== 0) {
        m = s.heap[--h];
        if (m > max_code) {
          continue;
        }
        if (tree[m * 2 + 1] /*.Len*/ !== bits) {
          // Tracev((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
          s.opt_len += (bits - tree[m * 2 + 1] /*.Len*/) * tree[m * 2] /*.Freq*/;
          tree[m * 2 + 1] /*.Len*/ = bits;
        }
        n--;
      }
    }
  };

  /* ===========================================================================
   * Generate the codes for a given tree and bit counts (which need not be
   * optimal).
   * IN assertion: the array bl_count contains the bit length statistics for
   * the given tree and the field len is set for all tree elements.
   * OUT assertion: the field code is set for all tree elements of non
   *     zero code length.
   */
  var gen_codes = function gen_codes(tree, max_code, bl_count) {
    //    ct_data *tree;             /* the tree to decorate */
    //    int max_code;              /* largest code with non zero frequency */
    //    ushf *bl_count;            /* number of codes at each bit length */

    var next_code = new Array(MAX_BITS$1 + 1); /* next code value for each bit length */
    var code = 0; /* running code value */
    var bits; /* bit index */
    var n; /* code index */

    /* The distribution counts are first used to generate the code values
     * without bit reversal.
     */
    for (bits = 1; bits <= MAX_BITS$1; bits++) {
      code = code + bl_count[bits - 1] << 1;
      next_code[bits] = code;
    }
    /* Check that the bit counts in bl_count are consistent. The last code
     * must be all ones.
     */
    //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
    //        "inconsistent bit counts");
    //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

    for (n = 0; n <= max_code; n++) {
      var len = tree[n * 2 + 1] /*.Len*/;
      if (len === 0) {
        continue;
      }
      /* Now reverse the bits */
      tree[n * 2] /*.Code*/ = bi_reverse(next_code[len]++, len);

      //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
      //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
    }
  };

  /* ===========================================================================
   * Initialize the various 'constant' tables.
   */
  var tr_static_init = function tr_static_init() {
    var n; /* iterates over tree elements */
    var bits; /* bit counter */
    var length; /* length value */
    var code; /* code value */
    var dist; /* distance index */
    var bl_count = new Array(MAX_BITS$1 + 1);
    /* number of codes at each bit length for an optimal tree */

    // do check in _tr_init()
    //if (static_init_done) return;

    /* For some embedded targets, global variables are not initialized: */
    /*#ifdef NO_INIT_GLOBAL_POINTERS
      static_l_desc.static_tree = static_ltree;
      static_l_desc.extra_bits = extra_lbits;
      static_d_desc.static_tree = static_dtree;
      static_d_desc.extra_bits = extra_dbits;
      static_bl_desc.extra_bits = extra_blbits;
    #endif*/

    /* Initialize the mapping length (0..255) -> length code (0..28) */
    length = 0;
    for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
      base_length[code] = length;
      for (n = 0; n < 1 << extra_lbits[code]; n++) {
        _length_code[length++] = code;
      }
    }
    //Assert (length == 256, "tr_static_init: length != 256");
    /* Note that the length 255 (match length 258) can be represented
     * in two different ways: code 284 + 5 bits or code 285, so we
     * overwrite length_code[255] to use the best encoding:
     */
    _length_code[length - 1] = code;

    /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
    dist = 0;
    for (code = 0; code < 16; code++) {
      base_dist[code] = dist;
      for (n = 0; n < 1 << extra_dbits[code]; n++) {
        _dist_code[dist++] = code;
      }
    }
    //Assert (dist == 256, "tr_static_init: dist != 256");
    dist >>= 7; /* from now on, all distances are divided by 128 */
    for (; code < D_CODES$1; code++) {
      base_dist[code] = dist << 7;
      for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
        _dist_code[256 + dist++] = code;
      }
    }
    //Assert (dist == 256, "tr_static_init: 256+dist != 512");

    /* Construct the codes of the static literal tree */
    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      bl_count[bits] = 0;
    }
    n = 0;
    while (n <= 143) {
      static_ltree[n * 2 + 1] /*.Len*/ = 8;
      n++;
      bl_count[8]++;
    }
    while (n <= 255) {
      static_ltree[n * 2 + 1] /*.Len*/ = 9;
      n++;
      bl_count[9]++;
    }
    while (n <= 279) {
      static_ltree[n * 2 + 1] /*.Len*/ = 7;
      n++;
      bl_count[7]++;
    }
    while (n <= 287) {
      static_ltree[n * 2 + 1] /*.Len*/ = 8;
      n++;
      bl_count[8]++;
    }
    /* Codes 286 and 287 do not exist, but we must include them in the
     * tree construction to get a canonical Huffman tree (longest code
     * all ones)
     */
    gen_codes(static_ltree, L_CODES$1 + 1, bl_count);

    /* The static distance tree is trivial: */
    for (n = 0; n < D_CODES$1; n++) {
      static_dtree[n * 2 + 1] /*.Len*/ = 5;
      static_dtree[n * 2] /*.Code*/ = bi_reverse(n, 5);
    }

    // Now data ready and we can init static trees
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);

    //static_init_done = true;
  };

  /* ===========================================================================
   * Initialize a new block.
   */
  var init_block = function init_block(s) {
    var n; /* iterates over tree elements */

    /* Initialize the trees. */
    for (n = 0; n < L_CODES$1; n++) {
      s.dyn_ltree[n * 2] /*.Freq*/ = 0;
    }
    for (n = 0; n < D_CODES$1; n++) {
      s.dyn_dtree[n * 2] /*.Freq*/ = 0;
    }
    for (n = 0; n < BL_CODES$1; n++) {
      s.bl_tree[n * 2] /*.Freq*/ = 0;
    }
    s.dyn_ltree[END_BLOCK * 2] /*.Freq*/ = 1;
    s.opt_len = s.static_len = 0;
    s.sym_next = s.matches = 0;
  };

  /* ===========================================================================
   * Flush the bit buffer and align the output on a byte boundary
   */
  var bi_windup = function bi_windup(s) {
    if (s.bi_valid > 8) {
      put_short(s, s.bi_buf);
    } else if (s.bi_valid > 0) {
      //put_byte(s, (Byte)s->bi_buf);
      s.pending_buf[s.pending++] = s.bi_buf;
    }
    s.bi_buf = 0;
    s.bi_valid = 0;
  };

  /* ===========================================================================
   * Compares to subtrees, using the tree depth as tie breaker when
   * the subtrees have equal frequency. This minimizes the worst case length.
   */
  var smaller = function smaller(tree, n, m, depth) {
    var _n2 = n * 2;
    var _m2 = m * 2;
    return tree[_n2] /*.Freq*/ < tree[_m2] /*.Freq*/ || tree[_n2] /*.Freq*/ === tree[_m2] /*.Freq*/ && depth[n] <= depth[m];
  };

  /* ===========================================================================
   * Restore the heap property by moving down the tree starting at node k,
   * exchanging a node with the smallest of its two sons if necessary, stopping
   * when the heap property is re-established (each father smaller than its
   * two sons).
   */
  var pqdownheap = function pqdownheap(s, tree, k) {
    //    deflate_state *s;
    //    ct_data *tree;  /* the tree to restore */
    //    int k;               /* node to move down */

    var v = s.heap[k];
    var j = k << 1; /* left son of k */
    while (j <= s.heap_len) {
      /* Set j to the smallest of the two sons: */
      if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
        j++;
      }
      /* Exit if v is smaller than both sons */
      if (smaller(tree, v, s.heap[j], s.depth)) {
        break;
      }

      /* Exchange v with the smallest son */
      s.heap[k] = s.heap[j];
      k = j;

      /* And continue down the tree, setting j to the left son of k */
      j <<= 1;
    }
    s.heap[k] = v;
  };

  // inlined manually
  // const SMALLEST = 1;

  /* ===========================================================================
   * Send the block data compressed using the given Huffman trees
   */
  var compress_block = function compress_block(s, ltree, dtree) {
    //    deflate_state *s;
    //    const ct_data *ltree; /* literal tree */
    //    const ct_data *dtree; /* distance tree */

    var dist; /* distance of matched string */
    var lc; /* match length or unmatched char (if dist == 0) */
    var sx = 0; /* running index in sym_buf */
    var code; /* the code to send */
    var extra; /* number of extra bits to send */

    if (s.sym_next !== 0) {
      do {
        dist = s.pending_buf[s.sym_buf + sx++] & 0xff;
        dist += (s.pending_buf[s.sym_buf + sx++] & 0xff) << 8;
        lc = s.pending_buf[s.sym_buf + sx++];
        if (dist === 0) {
          send_code(s, lc, ltree); /* send a literal byte */
          //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
        } else {
          /* Here, lc is the match length - MIN_MATCH */
          code = _length_code[lc];
          send_code(s, code + LITERALS$1 + 1, ltree); /* send the length code */
          extra = extra_lbits[code];
          if (extra !== 0) {
            lc -= base_length[code];
            send_bits(s, lc, extra); /* send the extra length bits */
          }

          dist--; /* dist is now the match distance - 1 */
          code = d_code(dist);
          //Assert (code < D_CODES, "bad d_code");

          send_code(s, code, dtree); /* send the distance code */
          extra = extra_dbits[code];
          if (extra !== 0) {
            dist -= base_dist[code];
            send_bits(s, dist, extra); /* send the extra distance bits */
          }
        } /* literal or match pair ? */

        /* Check that the overlay between pending_buf and sym_buf is ok: */
        //Assert(s->pending < s->lit_bufsize + sx, "pendingBuf overflow");
      } while (sx < s.sym_next);
    }
    send_code(s, END_BLOCK, ltree);
  };

  /* ===========================================================================
   * Construct one Huffman tree and assigns the code bit strings and lengths.
   * Update the total bit length for the current block.
   * IN assertion: the field freq is set for all tree elements.
   * OUT assertions: the fields len and code are set to the optimal bit length
   *     and corresponding code. The length opt_len is updated; static_len is
   *     also updated if stree is not null. The field max_code is set.
   */
  var build_tree = function build_tree(s, desc) {
    //    deflate_state *s;
    //    tree_desc *desc; /* the tree descriptor */

    var tree = desc.dyn_tree;
    var stree = desc.stat_desc.static_tree;
    var has_stree = desc.stat_desc.has_stree;
    var elems = desc.stat_desc.elems;
    var n, m; /* iterate over heap elements */
    var max_code = -1; /* largest code with non zero frequency */
    var node; /* new node being created */

    /* Construct the initial heap, with least frequent element in
     * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
     * heap[0] is not used.
     */
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE$1;
    for (n = 0; n < elems; n++) {
      if (tree[n * 2] /*.Freq*/ !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;
      } else {
        tree[n * 2 + 1] /*.Len*/ = 0;
      }
    }

    /* The pkzip format requires that at least one distance code exists,
     * and that at least one bit should be sent even if there is only one
     * possible code. So to avoid special checks later on we force at least
     * two codes of non zero frequency.
     */
    while (s.heap_len < 2) {
      node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
      tree[node * 2] /*.Freq*/ = 1;
      s.depth[node] = 0;
      s.opt_len--;
      if (has_stree) {
        s.static_len -= stree[node * 2 + 1] /*.Len*/;
      }
      /* node is 0 or 1 so it does not have extra bits */
    }

    desc.max_code = max_code;

    /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
     * establish sub-heaps of increasing lengths:
     */
    for (n = s.heap_len >> 1 /*int /2*/; n >= 1; n--) {
      pqdownheap(s, tree, n);
    }

    /* Construct the Huffman tree by repeatedly combining the least two
     * frequent nodes.
     */
    node = elems; /* next internal node of the tree */
    do {
      //pqremove(s, tree, n);  /* n = node of least frequency */
      /*** pqremove ***/
      n = s.heap[1 /*SMALLEST*/];
      s.heap[1 /*SMALLEST*/] = s.heap[s.heap_len--];
      pqdownheap(s, tree, 1 /*SMALLEST*/);
      /***/

      m = s.heap[1 /*SMALLEST*/]; /* m = node of next least frequency */

      s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
      s.heap[--s.heap_max] = m;

      /* Create a new node father of n and m */
      tree[node * 2] /*.Freq*/ = tree[n * 2] /*.Freq*/ + tree[m * 2] /*.Freq*/;
      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
      tree[n * 2 + 1] /*.Dad*/ = tree[m * 2 + 1] /*.Dad*/ = node;

      /* and insert the new node in the heap */
      s.heap[1 /*SMALLEST*/] = node++;
      pqdownheap(s, tree, 1 /*SMALLEST*/);
    } while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[1 /*SMALLEST*/];

    /* At this point, the fields freq and dad are set. We can now
     * generate the bit lengths.
     */
    gen_bitlen(s, desc);

    /* The field len is now set, we can generate the bit codes */
    gen_codes(tree, max_code, s.bl_count);
  };

  /* ===========================================================================
   * Scan a literal or distance tree to determine the frequencies of the codes
   * in the bit length tree.
   */
  var scan_tree = function scan_tree(s, tree, max_code) {
    //    deflate_state *s;
    //    ct_data *tree;   /* the tree to be scanned */
    //    int max_code;    /* and its largest code of non zero frequency */

    var n; /* iterates over all tree elements */
    var prevlen = -1; /* last emitted length */
    var curlen; /* length of current code */

    var nextlen = tree[0 * 2 + 1] /*.Len*/; /* length of next code */

    var count = 0; /* repeat count of the current code */
    var max_count = 7; /* max repeat count */
    var min_count = 4; /* min repeat count */

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] /*.Len*/ = 0xffff; /* guard */

    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1] /*.Len*/;

      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        s.bl_tree[curlen * 2] /*.Freq*/ += count;
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          s.bl_tree[curlen * 2] /*.Freq*/++;
        }
        s.bl_tree[REP_3_6 * 2] /*.Freq*/++;
      } else if (count <= 10) {
        s.bl_tree[REPZ_3_10 * 2] /*.Freq*/++;
      } else {
        s.bl_tree[REPZ_11_138 * 2] /*.Freq*/++;
      }

      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };

  /* ===========================================================================
   * Send a literal or distance tree in compressed form, using the codes in
   * bl_tree.
   */
  var send_tree = function send_tree(s, tree, max_code) {
    //    deflate_state *s;
    //    ct_data *tree; /* the tree to be scanned */
    //    int max_code;       /* and its largest code of non zero frequency */

    var n; /* iterates over all tree elements */
    var prevlen = -1; /* last emitted length */
    var curlen; /* length of current code */

    var nextlen = tree[0 * 2 + 1] /*.Len*/; /* length of next code */

    var count = 0; /* repeat count of the current code */
    var max_count = 7; /* max repeat count */
    var min_count = 4; /* min repeat count */

    /* tree[max_code+1].Len = -1; */ /* guard already set */
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1] /*.Len*/;

      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        do {
          send_code(s, curlen, s.bl_tree);
        } while (--count !== 0);
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          send_code(s, curlen, s.bl_tree);
          count--;
        }
        //Assert(count >= 3 && count <= 6, " 3_6?");
        send_code(s, REP_3_6, s.bl_tree);
        send_bits(s, count - 3, 2);
      } else if (count <= 10) {
        send_code(s, REPZ_3_10, s.bl_tree);
        send_bits(s, count - 3, 3);
      } else {
        send_code(s, REPZ_11_138, s.bl_tree);
        send_bits(s, count - 11, 7);
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };

  /* ===========================================================================
   * Construct the Huffman tree for the bit lengths and return the index in
   * bl_order of the last bit length code to send.
   */
  var build_bl_tree = function build_bl_tree(s) {
    var max_blindex; /* index of last bit length code of non zero freq */

    /* Determine the bit length frequencies for literal and distance trees */
    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

    /* Build the bit length tree: */
    build_tree(s, s.bl_desc);
    /* opt_len now includes the length of the tree representations, except
     * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
     */

    /* Determine the number of bit length codes to send. The pkzip format
     * requires that at least 4 bit length codes be sent. (appnote.txt says
     * 3 but the actual value used is 4.)
     */
    for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
      if (s.bl_tree[bl_order[max_blindex] * 2 + 1] /*.Len*/ !== 0) {
        break;
      }
    }
    /* Update opt_len to include the bit length tree and counts */
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
    //        s->opt_len, s->static_len));

    return max_blindex;
  };

  /* ===========================================================================
   * Send the header for a block using dynamic Huffman trees: the counts, the
   * lengths of the bit length codes, the literal tree and the distance tree.
   * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
   */
  var send_all_trees = function send_all_trees(s, lcodes, dcodes, blcodes) {
    //    deflate_state *s;
    //    int lcodes, dcodes, blcodes; /* number of codes for each tree */

    var rank; /* index in bl_order */

    //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
    //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
    //        "too many codes");
    //Tracev((stderr, "\nbl counts: "));
    send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
    send_bits(s, dcodes - 1, 5);
    send_bits(s, blcodes - 4, 4); /* not -3 as stated in appnote.txt */
    for (rank = 0; rank < blcodes; rank++) {
      //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
      send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1] /*.Len*/, 3);
    }
    //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

    send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
    //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

    send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
    //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
  };

  /* ===========================================================================
   * Check if the data type is TEXT or BINARY, using the following algorithm:
   * - TEXT if the two conditions below are satisfied:
   *    a) There are no non-portable control characters belonging to the
   *       "block list" (0..6, 14..25, 28..31).
   *    b) There is at least one printable character belonging to the
   *       "allow list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
   * - BINARY otherwise.
   * - The following partially-portable control characters form a
   *   "gray list" that is ignored in this detection algorithm:
   *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
   * IN assertion: the fields Freq of dyn_ltree are set.
   */
  var detect_data_type = function detect_data_type(s) {
    /* block_mask is the bit mask of block-listed bytes
     * set bits 0..6, 14..25, and 28..31
     * 0xf3ffc07f = binary 11110011111111111100000001111111
     */
    var block_mask = 0xf3ffc07f;
    var n;

    /* Check for non-textual ("block-listed") bytes. */
    for (n = 0; n <= 31; n++, block_mask >>>= 1) {
      if (block_mask & 1 && s.dyn_ltree[n * 2] /*.Freq*/ !== 0) {
        return Z_BINARY;
      }
    }

    /* Check for textual ("allow-listed") bytes. */
    if (s.dyn_ltree[9 * 2] /*.Freq*/ !== 0 || s.dyn_ltree[10 * 2] /*.Freq*/ !== 0 || s.dyn_ltree[13 * 2] /*.Freq*/ !== 0) {
      return Z_TEXT;
    }
    for (n = 32; n < LITERALS$1; n++) {
      if (s.dyn_ltree[n * 2] /*.Freq*/ !== 0) {
        return Z_TEXT;
      }
    }

    /* There are no "block-listed" or "allow-listed" bytes:
     * this stream either is empty or has tolerated ("gray-listed") bytes only.
     */
    return Z_BINARY;
  };
  var static_init_done = false;

  /* ===========================================================================
   * Initialize the tree data structures for a new zlib stream.
   */
  var _tr_init$1 = function _tr_init(s) {
    if (!static_init_done) {
      tr_static_init();
      static_init_done = true;
    }
    s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
    s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;

    /* Initialize the first block of the first file: */
    init_block(s);
  };

  /* ===========================================================================
   * Send a stored block
   */
  var _tr_stored_block$1 = function _tr_stored_block(s, buf, stored_len, last) {
    //DeflateState *s;
    //charf *buf;       /* input block */
    //ulg stored_len;   /* length of input block */
    //int last;         /* one if this is the last block for a file */

    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3); /* send block type */
    bi_windup(s); /* align on byte boundary */
    put_short(s, stored_len);
    put_short(s, ~stored_len);
    if (stored_len) {
      s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
    }
    s.pending += stored_len;
  };

  /* ===========================================================================
   * Send one empty static block to give enough lookahead for inflate.
   * This takes 10 bits, of which 7 may remain in the bit buffer.
   */
  var _tr_align$1 = function _tr_align(s) {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
  };

  /* ===========================================================================
   * Determine the best encoding for the current block: dynamic trees, static
   * trees or store, and write out the encoded block.
   */
  var _tr_flush_block$1 = function _tr_flush_block(s, buf, stored_len, last) {
    //DeflateState *s;
    //charf *buf;       /* input block, or NULL if too old */
    //ulg stored_len;   /* length of input block */
    //int last;         /* one if this is the last block for a file */

    var opt_lenb, static_lenb; /* opt_len and static_len in bytes */
    var max_blindex = 0; /* index of last bit length code of non zero freq */

    /* Build the Huffman trees unless a stored block is forced */
    if (s.level > 0) {
      /* Check if the file is binary or text */
      if (s.strm.data_type === Z_UNKNOWN$1) {
        s.strm.data_type = detect_data_type(s);
      }

      /* Construct the literal and distance trees */
      build_tree(s, s.l_desc);
      // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
      //        s->static_len));

      build_tree(s, s.d_desc);
      // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
      //        s->static_len));
      /* At this point, opt_len and static_len are the total bit lengths of
       * the compressed block data, excluding the tree representations.
       */

      /* Build the bit length tree for the above two trees, and get the index
       * in bl_order of the last bit length code to send.
       */
      max_blindex = build_bl_tree(s);

      /* Determine the best encoding. Compute the block lengths in bytes. */
      opt_lenb = s.opt_len + 3 + 7 >>> 3;
      static_lenb = s.static_len + 3 + 7 >>> 3;

      // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
      //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
      //        s->sym_next / 3));

      if (static_lenb <= opt_lenb) {
        opt_lenb = static_lenb;
      }
    } else {
      // Assert(buf != (char*)0, "lost buf");
      opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
    }

    if (stored_len + 4 <= opt_lenb && buf !== -1) {
      /* 4: two words for the lengths */

      /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
       * Otherwise we can't have processed more than WSIZE input bytes since
       * the last block flush, because compression would have been
       * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
       * transform a block into a stored block.
       */
      _tr_stored_block$1(s, buf, stored_len, last);
    } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {
      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
      compress_block(s, static_ltree, static_dtree);
    } else {
      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
      compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
    /* The above check is made mod 2^32, for files larger than 512 MB
     * and uLong implemented on 32 bits.
     */
    init_block(s);
    if (last) {
      bi_windup(s);
    }
    // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
    //       s->compressed_len-7*last));
  };

  /* ===========================================================================
   * Save the match info and tally the frequency counts. Return true if
   * the current block must be flushed.
   */
  var _tr_tally$1 = function _tr_tally(s, dist, lc) {
    //    deflate_state *s;
    //    unsigned dist;  /* distance of matched string */
    //    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */

    s.pending_buf[s.sym_buf + s.sym_next++] = dist;
    s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
    s.pending_buf[s.sym_buf + s.sym_next++] = lc;
    if (dist === 0) {
      /* lc is the unmatched char */
      s.dyn_ltree[lc * 2] /*.Freq*/++;
    } else {
      s.matches++;
      /* Here, lc is the match length - MIN_MATCH */
      dist--; /* dist = match distance - 1 */
      //Assert((ush)dist < (ush)MAX_DIST(s) &&
      //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
      //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

      s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2] /*.Freq*/++;
      s.dyn_dtree[d_code(dist) * 2] /*.Freq*/++;
    }

    return s.sym_next === s.sym_end;
  };
  var _tr_init_1 = _tr_init$1;
  var _tr_stored_block_1 = _tr_stored_block$1;
  var _tr_flush_block_1 = _tr_flush_block$1;
  var _tr_tally_1 = _tr_tally$1;
  var _tr_align_1 = _tr_align$1;
  var trees = {
    _tr_init: _tr_init_1,
    _tr_stored_block: _tr_stored_block_1,
    _tr_flush_block: _tr_flush_block_1,
    _tr_tally: _tr_tally_1,
    _tr_align: _tr_align_1
  };

  // Note: adler32 takes 12% for level 0 and 2% for level 6.
  // It isn't worth it to make additional optimizations as in original.
  // Small size is preferable.

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.
  var adler32 = function adler32(adler, buf, len, pos) {
    var s1 = adler & 0xffff | 0,
      s2 = adler >>> 16 & 0xffff | 0,
      n = 0;
    while (len !== 0) {
      // Set limit ~ twice less than 5552, to keep
      // s2 in 31-bits, because we force signed ints.
      // in other case %= will fail.
      n = len > 2000 ? 2000 : len;
      len -= n;
      do {
        s1 = s1 + buf[pos++] | 0;
        s2 = s2 + s1 | 0;
      } while (--n);
      s1 %= 65521;
      s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
  };
  var adler32_1 = adler32;

  // Note: we can't get significant speed boost here.
  // So write code to minimize size - no pregenerated tables
  // and array tools dependencies.

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  // Use ordinary array, since untyped makes no boost here
  var makeTable = function makeTable() {
    var c,
      table = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) {
        c = c & 1 ? 0xEDB88320 ^ c >>> 1 : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  };

  // Create table on load. Just 255 signed longs. Not a problem.
  var crcTable = new Uint32Array(makeTable());
  var crc32 = function crc32(crc, buf, len, pos) {
    var t = crcTable;
    var end = pos + len;
    crc ^= -1;
    for (var i = pos; i < end; i++) {
      crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 0xFF];
    }
    return crc ^ -1; // >>> 0;
  };

  var crc32_1 = crc32;

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.
  var messages = {
    2: 'need dictionary',
    /* Z_NEED_DICT       2  */
    1: 'stream end',
    /* Z_STREAM_END      1  */
    0: '',
    /* Z_OK              0  */
    '-1': 'file error',
    /* Z_ERRNO         (-1) */
    '-2': 'stream error',
    /* Z_STREAM_ERROR  (-2) */
    '-3': 'data error',
    /* Z_DATA_ERROR    (-3) */
    '-4': 'insufficient memory',
    /* Z_MEM_ERROR     (-4) */
    '-5': 'buffer error',
    /* Z_BUF_ERROR     (-5) */
    '-6': 'incompatible version' /* Z_VERSION_ERROR (-6) */
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.
  var constants$2 = {
    /* Allowed flush values; see deflate() and inflate() below for details */
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    /* Return codes for the compression/decompression functions. Negative values
    * are errors, positive values are used for special but normal events.
    */
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    //Z_VERSION_ERROR: -6,

    /* compression levels */
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    /* Possible values of the data_type field (though see inflate()) */
    Z_BINARY: 0,
    Z_TEXT: 1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN: 2,
    /* The deflate compression method */
    Z_DEFLATED: 8
    //Z_NULL:                 null // Use -1 or null inline, depending on var type
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  var _tr_init = trees._tr_init,
    _tr_stored_block = trees._tr_stored_block,
    _tr_flush_block = trees._tr_flush_block,
    _tr_tally = trees._tr_tally,
    _tr_align = trees._tr_align;

  /* Public constants ==========================================================*/
  /* ===========================================================================*/

  var Z_NO_FLUSH$2 = constants$2.Z_NO_FLUSH,
    Z_PARTIAL_FLUSH = constants$2.Z_PARTIAL_FLUSH,
    Z_FULL_FLUSH$1 = constants$2.Z_FULL_FLUSH,
    Z_FINISH$3 = constants$2.Z_FINISH,
    Z_BLOCK$1 = constants$2.Z_BLOCK,
    Z_OK$3 = constants$2.Z_OK,
    Z_STREAM_END$3 = constants$2.Z_STREAM_END,
    Z_STREAM_ERROR$2 = constants$2.Z_STREAM_ERROR,
    Z_DATA_ERROR$2 = constants$2.Z_DATA_ERROR,
    Z_BUF_ERROR$1 = constants$2.Z_BUF_ERROR,
    Z_DEFAULT_COMPRESSION$1 = constants$2.Z_DEFAULT_COMPRESSION,
    Z_FILTERED = constants$2.Z_FILTERED,
    Z_HUFFMAN_ONLY = constants$2.Z_HUFFMAN_ONLY,
    Z_RLE = constants$2.Z_RLE,
    Z_FIXED = constants$2.Z_FIXED,
    Z_DEFAULT_STRATEGY$1 = constants$2.Z_DEFAULT_STRATEGY,
    Z_UNKNOWN = constants$2.Z_UNKNOWN,
    Z_DEFLATED$2 = constants$2.Z_DEFLATED;

  /*============================================================================*/

  var MAX_MEM_LEVEL = 9;
  /* Maximum value for memLevel in deflateInit2 */
  var MAX_WBITS$1 = 15;
  /* 32K LZ77 window */
  var DEF_MEM_LEVEL = 8;
  var LENGTH_CODES = 29;
  /* number of length codes, not counting the special END_BLOCK code */
  var LITERALS = 256;
  /* number of literal bytes 0..255 */
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  /* number of Literal or Length codes, including the END_BLOCK code */
  var D_CODES = 30;
  /* number of distance codes */
  var BL_CODES = 19;
  /* number of codes used to transfer the bit lengths */
  var HEAP_SIZE = 2 * L_CODES + 1;
  /* maximum heap size */
  var MAX_BITS = 15;
  /* All codes must not exceed MAX_BITS bits */

  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
  var PRESET_DICT = 0x20;
  var INIT_STATE = 42; /* zlib header -> BUSY_STATE */
  //#ifdef GZIP
  var GZIP_STATE = 57; /* gzip header -> BUSY_STATE | EXTRA_STATE */
  //#endif
  var EXTRA_STATE = 69; /* gzip extra block -> NAME_STATE */
  var NAME_STATE = 73; /* gzip file name -> COMMENT_STATE */
  var COMMENT_STATE = 91; /* gzip comment -> HCRC_STATE */
  var HCRC_STATE = 103; /* gzip header CRC -> BUSY_STATE */
  var BUSY_STATE = 113; /* deflate -> FINISH_STATE */
  var FINISH_STATE = 666; /* stream complete */

  var BS_NEED_MORE = 1; /* block not completed, need more input or more output */
  var BS_BLOCK_DONE = 2; /* block flush performed */
  var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
  var BS_FINISH_DONE = 4; /* finish done, accept no more input or output */

  var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

  var err = function err(strm, errorCode) {
    strm.msg = messages[errorCode];
    return errorCode;
  };
  var rank = function rank(f) {
    return f * 2 - (f > 4 ? 9 : 0);
  };
  var zero = function zero(buf) {
    var len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  };

  /* ===========================================================================
   * Slide the hash table when sliding the window down (could be avoided with 32
   * bit values at the expense of memory usage). We slide even when level == 0 to
   * keep the hash table consistent if we switch back to level > 0 later.
   */
  var slide_hash = function slide_hash(s) {
    var n, m;
    var p;
    var wsize = s.w_size;
    n = s.hash_size;
    p = n;
    do {
      m = s.head[--p];
      s.head[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
    n = wsize;
    //#ifndef FASTEST
    p = n;
    do {
      m = s.prev[--p];
      s.prev[p] = m >= wsize ? m - wsize : 0;
      /* If n is not on any hash chain, prev[n] is garbage but
       * its value will never be used.
       */
    } while (--n);
    //#endif
  };

  /* eslint-disable new-cap */
  var HASH_ZLIB = function HASH_ZLIB(s, prev, data) {
    return (prev << s.hash_shift ^ data) & s.hash_mask;
  };
  // This hash causes less collisions, https://github.com/nodeca/pako/issues/135
  // But breaks binary compatibility
  //let HASH_FAST = (s, prev, data) => ((prev << 8) + (prev >> 8) + (data << 4)) & s.hash_mask;
  var HASH = HASH_ZLIB;

  /* =========================================================================
   * Flush as much pending output as possible. All deflate() output, except for
   * some deflate_stored() output, goes through this function so some
   * applications may wish to modify it to avoid allocating a large
   * strm->next_out buffer and copying into it. (See also read_buf()).
   */
  var flush_pending = function flush_pending(strm) {
    var s = strm.state;

    //_tr_flush_bits(s);
    var len = s.pending;
    if (len > strm.avail_out) {
      len = strm.avail_out;
    }
    if (len === 0) {
      return;
    }
    strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) {
      s.pending_out = 0;
    }
  };
  var flush_block_only = function flush_block_only(s, last) {
    _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    flush_pending(s.strm);
  };
  var put_byte = function put_byte(s, b) {
    s.pending_buf[s.pending++] = b;
  };

  /* =========================================================================
   * Put a short in the pending buffer. The 16-bit value is put in MSB order.
   * IN assertion: the stream state is correct and there is enough room in
   * pending_buf.
   */
  var putShortMSB = function putShortMSB(s, b) {
    //  put_byte(s, (Byte)(b >> 8));
    //  put_byte(s, (Byte)(b & 0xff));
    s.pending_buf[s.pending++] = b >>> 8 & 0xff;
    s.pending_buf[s.pending++] = b & 0xff;
  };

  /* ===========================================================================
   * Read a new buffer from the current input stream, update the adler32
   * and total number of bytes read.  All deflate() input goes through
   * this function so some applications may wish to modify it to avoid
   * allocating a large strm->input buffer and copying from it.
   * (See also flush_pending()).
   */
  var read_buf = function read_buf(strm, buf, start, size) {
    var len = strm.avail_in;
    if (len > size) {
      len = size;
    }
    if (len === 0) {
      return 0;
    }
    strm.avail_in -= len;

    // zmemcpy(buf, strm->next_in, len);
    buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
    if (strm.state.wrap === 1) {
      strm.adler = adler32_1(strm.adler, buf, len, start);
    } else if (strm.state.wrap === 2) {
      strm.adler = crc32_1(strm.adler, buf, len, start);
    }
    strm.next_in += len;
    strm.total_in += len;
    return len;
  };

  /* ===========================================================================
   * Set match_start to the longest match starting at the given string and
   * return its length. Matches shorter or equal to prev_length are discarded,
   * in which case the result is equal to prev_length and match_start is
   * garbage.
   * IN assertions: cur_match is the head of the hash chain for the current
   *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
   * OUT assertion: the match length is not greater than s->lookahead.
   */
  var longest_match = function longest_match(s, cur_match) {
    var chain_length = s.max_chain_length; /* max hash chain length */
    var scan = s.strstart; /* current string */
    var match; /* matched string */
    var len; /* length of current match */
    var best_len = s.prev_length; /* best match length so far */
    var nice_match = s.nice_match; /* stop if match long enough */
    var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0 /*NIL*/;

    var _win = s.window; // shortcut

    var wmask = s.w_mask;
    var prev = s.prev;

    /* Stop when cur_match becomes <= limit. To simplify the code,
     * we prevent matches with the string of window index 0.
     */

    var strend = s.strstart + MAX_MATCH;
    var scan_end1 = _win[scan + best_len - 1];
    var scan_end = _win[scan + best_len];

    /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
     * It is easy to get rid of this optimization if necessary.
     */
    // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

    /* Do not waste too much time if we already have a good match: */
    if (s.prev_length >= s.good_match) {
      chain_length >>= 2;
    }
    /* Do not look for matches beyond the end of the input. This is necessary
     * to make deflate deterministic.
     */
    if (nice_match > s.lookahead) {
      nice_match = s.lookahead;
    }

    // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

    do {
      // Assert(cur_match < s->strstart, "no future");
      match = cur_match;

      /* Skip to next match if the match length cannot increase
       * or if the match length is less than 2.  Note that the checks below
       * for insufficient lookahead only occur occasionally for performance
       * reasons.  Therefore uninitialized memory will be accessed, and
       * conditional jumps will be made that depend on those values.
       * However the length of the match is limited to the lookahead, so
       * the output of deflate is not affected by the uninitialized values.
       */

      if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
        continue;
      }

      /* The check at best_len-1 can be removed because it will be made
       * again later. (This heuristic is not always a win.)
       * It is not necessary to compare scan[2] and match[2] since they
       * are always equal when the other bytes match, given that
       * the hash keys are equal and that HASH_BITS >= 8.
       */
      scan += 2;
      match++;
      // Assert(*scan == *match, "match[2]?");

      /* We check for insufficient lookahead only every 8th comparison;
       * the 256th check will be made at strstart+258.
       */
      do {
        /*jshint noempty:false*/
      } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);

      // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

      len = MAX_MATCH - (strend - scan);
      scan = strend - MAX_MATCH;
      if (len > best_len) {
        s.match_start = cur_match;
        best_len = len;
        if (len >= nice_match) {
          break;
        }
        scan_end1 = _win[scan + best_len - 1];
        scan_end = _win[scan + best_len];
      }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s.lookahead) {
      return best_len;
    }
    return s.lookahead;
  };

  /* ===========================================================================
   * Fill the window when the lookahead becomes insufficient.
   * Updates strstart and lookahead.
   *
   * IN assertion: lookahead < MIN_LOOKAHEAD
   * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
   *    At least one byte has been read, or avail_in == 0; reads are
   *    performed for at least two bytes (required for the zip translate_eol
   *    option -- not supported here).
   */
  var fill_window = function fill_window(s) {
    var _w_size = s.w_size;
    var n, more, str;

    //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

    do {
      more = s.window_size - s.lookahead - s.strstart;

      // JS ints have 32 bit, block below not needed
      /* Deal with !@#$% 64K limit: */
      //if (sizeof(int) <= 2) {
      //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
      //        more = wsize;
      //
      //  } else if (more == (unsigned)(-1)) {
      //        /* Very unlikely, but possible on 16 bit machine if
      //         * strstart == 0 && lookahead == 1 (input done a byte at time)
      //         */
      //        more--;
      //    }
      //}

      /* If the window is almost full and there is insufficient lookahead,
       * move the upper half to the lower one to make room in the upper half.
       */
      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
        s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
        s.match_start -= _w_size;
        s.strstart -= _w_size;
        /* we now have strstart >= MAX_DIST */
        s.block_start -= _w_size;
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
        slide_hash(s);
        more += _w_size;
      }
      if (s.strm.avail_in === 0) {
        break;
      }

      /* If there was no sliding:
       *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
       *    more == window_size - lookahead - strstart
       * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
       * => more >= window_size - 2*WSIZE + 2
       * In the BIG_MEM or MMAP case (not yet supported),
       *   window_size == input_size + MIN_LOOKAHEAD  &&
       *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
       * Otherwise, window_size == 2*WSIZE so more >= 2.
       * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
       */
      //Assert(more >= 2, "more < 2");
      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
      s.lookahead += n;

      /* Initialize the hash value now that we have some input: */
      if (s.lookahead + s.insert >= MIN_MATCH) {
        str = s.strstart - s.insert;
        s.ins_h = s.window[str];

        /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
        //#if MIN_MATCH != 3
        //        Call update_hash() MIN_MATCH-3 more times
        //#endif
        while (s.insert) {
          /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
          s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
          s.insert--;
          if (s.lookahead + s.insert < MIN_MATCH) {
            break;
          }
        }
      }
      /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
       * but this is not important since only literal bytes will be emitted.
       */
    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

    /* If the WIN_INIT bytes after the end of the current data have never been
     * written, then zero those bytes in order to avoid memory check reports of
     * the use of uninitialized (or uninitialised as Julian writes) bytes by
     * the longest match routines.  Update the high water mark for the next
     * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
     * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
     */
    //  if (s.high_water < s.window_size) {
    //    const curr = s.strstart + s.lookahead;
    //    let init = 0;
    //
    //    if (s.high_water < curr) {
    //      /* Previous high water mark below current data -- zero WIN_INIT
    //       * bytes or up to end of window, whichever is less.
    //       */
    //      init = s.window_size - curr;
    //      if (init > WIN_INIT)
    //        init = WIN_INIT;
    //      zmemzero(s->window + curr, (unsigned)init);
    //      s->high_water = curr + init;
    //    }
    //    else if (s->high_water < (ulg)curr + WIN_INIT) {
    //      /* High water mark at or above current data, but below current data
    //       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
    //       * to end of window, whichever is less.
    //       */
    //      init = (ulg)curr + WIN_INIT - s->high_water;
    //      if (init > s->window_size - s->high_water)
    //        init = s->window_size - s->high_water;
    //      zmemzero(s->window + s->high_water, (unsigned)init);
    //      s->high_water += init;
    //    }
    //  }
    //
    //  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
    //    "not enough room for search");
  };

  /* ===========================================================================
   * Copy without compression as much as possible from the input stream, return
   * the current block state.
   *
   * In case deflateParams() is used to later switch to a non-zero compression
   * level, s->matches (otherwise unused when storing) keeps track of the number
   * of hash table slides to perform. If s->matches is 1, then one hash table
   * slide will be done when switching. If s->matches is 2, the maximum value
   * allowed here, then the hash table will be cleared, since two or more slides
   * is the same as a clear.
   *
   * deflate_stored() is written to minimize the number of times an input byte is
   * copied. It is most efficient with large input and output buffers, which
   * maximizes the opportunites to have a single copy from next_in to next_out.
   */
  var deflate_stored = function deflate_stored(s, flush) {
    /* Smallest worthy block size when not flushing or finishing. By default
     * this is 32K. This can be as small as 507 bytes for memLevel == 1. For
     * large input and output buffers, the stored block size will be larger.
     */
    var min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;

    /* Copy as many min_block or larger stored blocks directly to next_out as
     * possible. If flushing, copy the remaining available input to next_out as
     * stored blocks, if there is enough space.
     */
    var len,
      left,
      have,
      last = 0;
    var used = s.strm.avail_in;
    do {
      /* Set len to the maximum size block that we can copy directly with the
       * available input data and output space. Set left to how much of that
       * would be copied from what's left in the window.
       */
      len = 65535 /* MAX_STORED */; /* maximum deflate stored block length */
      have = s.bi_valid + 42 >> 3; /* number of header bytes */
      if (s.strm.avail_out < have) {
        /* need room for header */
        break;
      }
      /* maximum stored block length that will fit in avail_out: */
      have = s.strm.avail_out - have;
      left = s.strstart - s.block_start; /* bytes left in window */
      if (len > left + s.strm.avail_in) {
        len = left + s.strm.avail_in; /* limit len to the input */
      }

      if (len > have) {
        len = have; /* limit len to the output */
      }

      /* If the stored block would be less than min_block in length, or if
       * unable to copy all of the available input when flushing, then try
       * copying to the window and the pending buffer instead. Also don't
       * write an empty block when flushing -- deflate() does that.
       */
      if (len < min_block && (len === 0 && flush !== Z_FINISH$3 || flush === Z_NO_FLUSH$2 || len !== left + s.strm.avail_in)) {
        break;
      }

      /* Make a dummy stored block in pending to get the header bytes,
       * including any pending bits. This also updates the debugging counts.
       */
      last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
      _tr_stored_block(s, 0, 0, last);

      /* Replace the lengths in the dummy stored block with len. */
      s.pending_buf[s.pending - 4] = len;
      s.pending_buf[s.pending - 3] = len >> 8;
      s.pending_buf[s.pending - 2] = ~len;
      s.pending_buf[s.pending - 1] = ~len >> 8;

      /* Write the stored block header bytes. */
      flush_pending(s.strm);

      //#ifdef ZLIB_DEBUG
      //    /* Update debugging counts for the data about to be copied. */
      //    s->compressed_len += len << 3;
      //    s->bits_sent += len << 3;
      //#endif

      /* Copy uncompressed bytes from the window to next_out. */
      if (left) {
        if (left > len) {
          left = len;
        }
        //zmemcpy(s->strm->next_out, s->window + s->block_start, left);
        s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
        s.strm.next_out += left;
        s.strm.avail_out -= left;
        s.strm.total_out += left;
        s.block_start += left;
        len -= left;
      }

      /* Copy uncompressed bytes directly from next_in to next_out, updating
       * the check value.
       */
      if (len) {
        read_buf(s.strm, s.strm.output, s.strm.next_out, len);
        s.strm.next_out += len;
        s.strm.avail_out -= len;
        s.strm.total_out += len;
      }
    } while (last === 0);

    /* Update the sliding window with the last s->w_size bytes of the copied
     * data, or append all of the copied data to the existing window if less
     * than s->w_size bytes were copied. Also update the number of bytes to
     * insert in the hash tables, in the event that deflateParams() switches to
     * a non-zero compression level.
     */
    used -= s.strm.avail_in; /* number of input bytes directly copied */
    if (used) {
      /* If any input was used, then no unused input remains in the window,
       * therefore s->block_start == s->strstart.
       */
      if (used >= s.w_size) {
        /* supplant the previous history */
        s.matches = 2; /* clear hash */
        //zmemcpy(s->window, s->strm->next_in - s->w_size, s->w_size);
        s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
        s.strstart = s.w_size;
        s.insert = s.strstart;
      } else {
        if (s.window_size - s.strstart <= used) {
          /* Slide the window down. */
          s.strstart -= s.w_size;
          //zmemcpy(s->window, s->window + s->w_size, s->strstart);
          s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
          if (s.matches < 2) {
            s.matches++; /* add a pending slide_hash() */
          }

          if (s.insert > s.strstart) {
            s.insert = s.strstart;
          }
        }
        //zmemcpy(s->window + s->strstart, s->strm->next_in - used, used);
        s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
        s.strstart += used;
        s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
      }
      s.block_start = s.strstart;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }

    /* If the last block was written to next_out, then done. */
    if (last) {
      return BS_FINISH_DONE;
    }

    /* If flushing and all input has been consumed, then done. */
    if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 && s.strm.avail_in === 0 && s.strstart === s.block_start) {
      return BS_BLOCK_DONE;
    }

    /* Fill the window with any remaining input. */
    have = s.window_size - s.strstart;
    if (s.strm.avail_in > have && s.block_start >= s.w_size) {
      /* Slide the window down. */
      s.block_start -= s.w_size;
      s.strstart -= s.w_size;
      //zmemcpy(s->window, s->window + s->w_size, s->strstart);
      s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
      if (s.matches < 2) {
        s.matches++; /* add a pending slide_hash() */
      }

      have += s.w_size; /* more space now */
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
    }
    if (have > s.strm.avail_in) {
      have = s.strm.avail_in;
    }
    if (have) {
      read_buf(s.strm, s.window, s.strstart, have);
      s.strstart += have;
      s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }

    /* There was not enough avail_out to write a complete worthy or flushed
     * stored block to next_out. Write a stored block to pending instead, if we
     * have enough input for a worthy block, or if flushing and there is enough
     * room for the remaining input as a stored block in the pending buffer.
     */
    have = s.bi_valid + 42 >> 3; /* number of header bytes */
    /* maximum stored block length that will fit in pending: */
    have = s.pending_buf_size - have > 65535 /* MAX_STORED */ ? 65535 /* MAX_STORED */ : s.pending_buf_size - have;
    min_block = have > s.w_size ? s.w_size : have;
    left = s.strstart - s.block_start;
    if (left >= min_block || (left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 && s.strm.avail_in === 0 && left <= have) {
      len = left > have ? have : left;
      last = flush === Z_FINISH$3 && s.strm.avail_in === 0 && len === left ? 1 : 0;
      _tr_stored_block(s, s.block_start, len, last);
      s.block_start += len;
      flush_pending(s.strm);
    }

    /* We've done all we can with the available input and output. */
    return last ? BS_FINISH_STARTED : BS_NEED_MORE;
  };

  /* ===========================================================================
   * Compress as much as possible from the input stream, return the current
   * block state.
   * This function does not perform lazy evaluation of matches and inserts
   * new strings in the dictionary only for unmatched strings or for short
   * matches. It is used only for the fast compression options.
   */
  var deflate_fast = function deflate_fast(s, flush) {
    var hash_head; /* head of the hash chain */
    var bflush; /* set if current block must be flushed */

    for (;;) {
      /* Make sure that we always have enough lookahead, except
       * at the end of the input file. We need MAX_MATCH bytes
       * for the next match, plus MIN_MATCH bytes to insert the
       * string following the next match.
       */
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break; /* flush the current block */
        }
      }

      /* Insert the string window[strstart .. strstart+2] in the
       * dictionary, and set hash_head to the head of the hash chain:
       */
      hash_head = 0 /*NIL*/;
      if (s.lookahead >= MIN_MATCH) {
        /*** INSERT_STRING(s, s.strstart, hash_head); ***/
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
        /***/
      }

      /* Find the longest match, discarding those <= prev_length.
       * At this point we have always match_length < MIN_MATCH
       */
      if (hash_head !== 0 /*NIL*/ && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        /* To simplify the code, we prevent matches with the string
         * of window index 0 (in particular we have to avoid a match
         * of the string with itself at the start of the input file).
         */
        s.match_length = longest_match(s, hash_head);
        /* longest_match() sets match_start */
      }

      if (s.match_length >= MIN_MATCH) {
        // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

        /*** _tr_tally_dist(s, s.strstart - s.match_start,
                       s.match_length - MIN_MATCH, bflush); ***/
        bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;

        /* Insert new strings in the hash table only if the match length
         * is not too large. This saves time but degrades compression.
         */
        if (s.match_length <= s.max_lazy_match /*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
          s.match_length--; /* string at strstart already in table */
          do {
            s.strstart++;
            /*** INSERT_STRING(s, s.strstart, hash_head); ***/
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
            /***/
            /* strstart never exceeds WSIZE-MAX_MATCH, so there are
             * always MIN_MATCH bytes ahead.
             */
          } while (--s.match_length !== 0);
          s.strstart++;
        } else {
          s.strstart += s.match_length;
          s.match_length = 0;
          s.ins_h = s.window[s.strstart];
          /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);

          //#if MIN_MATCH != 3
          //                Call UPDATE_HASH() MIN_MATCH-3 more times
          //#endif
          /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
           * matter since it will be recomputed at next deflate call.
           */
        }
      } else {
        /* No match, output a literal byte */
        //Tracevv((stderr,"%c", s.window[s.strstart]));
        /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }
    }

    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      /*** FLUSH_BLOCK(s, 1); ***/
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      /***/
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }

    return BS_BLOCK_DONE;
  };

  /* ===========================================================================
   * Same as above, but achieves better compression. We use a lazy
   * evaluation for matches: a match is finally adopted only if there is
   * no better match at the next window position.
   */
  var deflate_slow = function deflate_slow(s, flush) {
    var hash_head; /* head of hash chain */
    var bflush; /* set if current block must be flushed */

    var max_insert;

    /* Process the input block. */
    for (;;) {
      /* Make sure that we always have enough lookahead, except
       * at the end of the input file. We need MAX_MATCH bytes
       * for the next match, plus MIN_MATCH bytes to insert the
       * string following the next match.
       */
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        } /* flush the current block */
      }

      /* Insert the string window[strstart .. strstart+2] in the
       * dictionary, and set hash_head to the head of the hash chain:
       */
      hash_head = 0 /*NIL*/;
      if (s.lookahead >= MIN_MATCH) {
        /*** INSERT_STRING(s, s.strstart, hash_head); ***/
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
        /***/
      }

      /* Find the longest match, discarding those <= prev_length.
       */
      s.prev_length = s.match_length;
      s.prev_match = s.match_start;
      s.match_length = MIN_MATCH - 1;
      if (hash_head !== 0 /*NIL*/ && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD /*MAX_DIST(s)*/) {
        /* To simplify the code, we prevent matches with the string
         * of window index 0 (in particular we have to avoid a match
         * of the string with itself at the start of the input file).
         */
        s.match_length = longest_match(s, hash_head);
        /* longest_match() sets match_start */

        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096 /*TOO_FAR*/)) {
          /* If prev_match is also MIN_MATCH, match_start is garbage
           * but we will ignore the current match anyway.
           */
          s.match_length = MIN_MATCH - 1;
        }
      }
      /* If there was a match at the previous step and the current
       * match is not better, output the previous match:
       */
      if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
        max_insert = s.strstart + s.lookahead - MIN_MATCH;
        /* Do not insert strings in hash table beyond this. */

        //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

        /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                       s.prev_length - MIN_MATCH, bflush);***/
        bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
        /* Insert in hash table all strings up to the end of the match.
         * strstart-1 and strstart are already inserted. If there is not
         * enough lookahead, the last two strings are not inserted in
         * the hash table.
         */
        s.lookahead -= s.prev_length - 1;
        s.prev_length -= 2;
        do {
          if (++s.strstart <= max_insert) {
            /*** INSERT_STRING(s, s.strstart, hash_head); ***/
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
            /***/
          }
        } while (--s.prev_length !== 0);
        s.match_available = 0;
        s.match_length = MIN_MATCH - 1;
        s.strstart++;
        if (bflush) {
          /*** FLUSH_BLOCK(s, 0); ***/
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
          /***/
        }
      } else if (s.match_available) {
        /* If there was no match at the previous position, output a
         * single literal. If there was a match but the current match
         * is longer, truncate the previous match to a single literal.
         */
        //Tracevv((stderr,"%c", s->window[s->strstart-1]));
        /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
        bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
        if (bflush) {
          /*** FLUSH_BLOCK_ONLY(s, 0) ***/
          flush_block_only(s, false);
          /***/
        }

        s.strstart++;
        s.lookahead--;
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      } else {
        /* There is no previous match to compare with, wait for
         * the next step to decide.
         */
        s.match_available = 1;
        s.strstart++;
        s.lookahead--;
      }
    }
    //Assert (flush != Z_NO_FLUSH, "no flush?");
    if (s.match_available) {
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
      s.match_available = 0;
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      /*** FLUSH_BLOCK(s, 1); ***/
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      /***/
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }

    return BS_BLOCK_DONE;
  };

  /* ===========================================================================
   * For Z_RLE, simply look for runs of bytes, generate matches only of distance
   * one.  Do not maintain a hash table.  (It will be regenerated if this run of
   * deflate switches away from Z_RLE.)
   */
  var deflate_rle = function deflate_rle(s, flush) {
    var bflush; /* set if current block must be flushed */
    var prev; /* byte at distance one to match */
    var scan, strend; /* scan goes up to strend for length of run */

    var _win = s.window;
    for (;;) {
      /* Make sure that we always have enough lookahead, except
       * at the end of the input file. We need MAX_MATCH bytes
       * for the longest run, plus one for the unrolled loop.
       */
      if (s.lookahead <= MAX_MATCH) {
        fill_window(s);
        if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        } /* flush the current block */
      }

      /* See how many times the previous byte repeats */
      s.match_length = 0;
      if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
        scan = s.strstart - 1;
        prev = _win[scan];
        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
          strend = s.strstart + MAX_MATCH;
          do {
            /*jshint noempty:false*/
          } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
          s.match_length = MAX_MATCH - (strend - scan);
          if (s.match_length > s.lookahead) {
            s.match_length = s.lookahead;
          }
        }
        //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
      }

      /* Emit match if have run of MIN_MATCH or longer, else emit literal */
      if (s.match_length >= MIN_MATCH) {
        //check_match(s, s.strstart, s.strstart - 1, s.match_length);

        /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
        bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        s.strstart += s.match_length;
        s.match_length = 0;
      } else {
        /* No match, output a literal byte */
        //Tracevv((stderr,"%c", s->window[s->strstart]));
        /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }
    }

    s.insert = 0;
    if (flush === Z_FINISH$3) {
      /*** FLUSH_BLOCK(s, 1); ***/
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      /***/
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }

    return BS_BLOCK_DONE;
  };

  /* ===========================================================================
   * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
   * (It will be regenerated if this run of deflate switches away from Huffman.)
   */
  var deflate_huff = function deflate_huff(s, flush) {
    var bflush; /* set if current block must be flushed */

    for (;;) {
      /* Make sure that we have a literal to write. */
      if (s.lookahead === 0) {
        fill_window(s);
        if (s.lookahead === 0) {
          if (flush === Z_NO_FLUSH$2) {
            return BS_NEED_MORE;
          }
          break; /* flush the current block */
        }
      }

      /* Output a literal byte */
      s.match_length = 0;
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }
    }

    s.insert = 0;
    if (flush === Z_FINISH$3) {
      /*** FLUSH_BLOCK(s, 1); ***/
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      /***/
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }

    return BS_BLOCK_DONE;
  };

  /* Values for max_lazy_match, good_match and max_chain_length, depending on
   * the desired pack level (0..9). The values given below have been tuned to
   * exclude worst case performance for pathological files. Better values may be
   * found for specific files.
   */
  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
  }
  var configuration_table = [/*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored), /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast), /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast), /* 2 */
  new Config(4, 6, 32, 32, deflate_fast), /* 3 */

  new Config(4, 4, 16, 16, deflate_slow), /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow), /* 5 */
  new Config(8, 16, 128, 128, deflate_slow), /* 6 */
  new Config(8, 32, 128, 256, deflate_slow), /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow), /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow) /* 9 max compression */];

  /* ===========================================================================
   * Initialize the "longest match" routines for a new zlib stream
   */
  var lm_init = function lm_init(s) {
    s.window_size = 2 * s.w_size;

    /*** CLEAR_HASH(s); ***/
    zero(s.head); // Fill with NIL (= 0);

    /* Set the default configuration parameters:
     */
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    s.ins_h = 0;
  };
  function DeflateState() {
    this.strm = null; /* pointer back to this zlib stream */
    this.status = 0; /* as the name implies */
    this.pending_buf = null; /* output still pending */
    this.pending_buf_size = 0; /* size of pending_buf */
    this.pending_out = 0; /* next pending byte to output to the stream */
    this.pending = 0; /* nb of bytes in the pending buffer */
    this.wrap = 0; /* bit 0 true for zlib, bit 1 true for gzip */
    this.gzhead = null; /* gzip header information to write */
    this.gzindex = 0; /* where in extra, name, or comment */
    this.method = Z_DEFLATED$2; /* can only be DEFLATED */
    this.last_flush = -1; /* value of flush param for previous deflate call */

    this.w_size = 0; /* LZ77 window size (32K by default) */
    this.w_bits = 0; /* log2(w_size)  (8..16) */
    this.w_mask = 0; /* w_size - 1 */

    this.window = null;
    /* Sliding window. Input bytes are read into the second half of the window,
     * and move to the first half later to keep a dictionary of at least wSize
     * bytes. With this organization, matches are limited to a distance of
     * wSize-MAX_MATCH bytes, but this ensures that IO is always
     * performed with a length multiple of the block size.
     */

    this.window_size = 0;
    /* Actual size of window: 2*wSize, except when the user input buffer
     * is directly used as sliding window.
     */

    this.prev = null;
    /* Link to older string with same hash index. To limit the size of this
     * array to 64K, this link is maintained only for the last 32K strings.
     * An index in this array is thus a window index modulo 32K.
     */

    this.head = null; /* Heads of the hash chains or NIL. */

    this.ins_h = 0; /* hash index of string to be inserted */
    this.hash_size = 0; /* number of elements in hash table */
    this.hash_bits = 0; /* log2(hash_size) */
    this.hash_mask = 0; /* hash_size-1 */

    this.hash_shift = 0;
    /* Number of bits by which ins_h must be shifted at each input
     * step. It must be such that after MIN_MATCH steps, the oldest
     * byte no longer takes part in the hash key, that is:
     *   hash_shift * MIN_MATCH >= hash_bits
     */

    this.block_start = 0;
    /* Window position at the beginning of the current output block. Gets
     * negative when the window is moved backwards.
     */

    this.match_length = 0; /* length of best match */
    this.prev_match = 0; /* previous match */
    this.match_available = 0; /* set if previous match exists */
    this.strstart = 0; /* start of string to insert */
    this.match_start = 0; /* start of matching string */
    this.lookahead = 0; /* number of valid bytes ahead in window */

    this.prev_length = 0;
    /* Length of the best match at previous step. Matches not greater than this
     * are discarded. This is used in the lazy match evaluation.
     */

    this.max_chain_length = 0;
    /* To speed up deflation, hash chains are never searched beyond this
     * length.  A higher limit improves compression ratio but degrades the
     * speed.
     */

    this.max_lazy_match = 0;
    /* Attempt to find a better match only when the current match is strictly
     * smaller than this value. This mechanism is used only for compression
     * levels >= 4.
     */
    // That's alias to max_lazy_match, don't use directly
    //this.max_insert_length = 0;
    /* Insert new strings in the hash table only if the match length is not
     * greater than this length. This saves time but degrades compression.
     * max_insert_length is used only for compression levels <= 3.
     */

    this.level = 0; /* compression level (1..9) */
    this.strategy = 0; /* favor or force Huffman coding*/

    this.good_match = 0;
    /* Use a faster search when the previous match is longer than this */

    this.nice_match = 0; /* Stop searching when current match exceeds this */

    /* used by trees.c: */

    /* Didn't use ct_data typedef below to suppress compiler warning */

    // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
    // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
    // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

    // Use flat array of DOUBLE size, with interleaved fata,
    // because JS does not support effective
    this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
    this.dyn_dtree = new Uint16Array((2 * D_CODES + 1) * 2);
    this.bl_tree = new Uint16Array((2 * BL_CODES + 1) * 2);
    zero(this.dyn_ltree);
    zero(this.dyn_dtree);
    zero(this.bl_tree);
    this.l_desc = null; /* desc. for literal tree */
    this.d_desc = null; /* desc. for distance tree */
    this.bl_desc = null; /* desc. for bit length tree */

    //ush bl_count[MAX_BITS+1];
    this.bl_count = new Uint16Array(MAX_BITS + 1);
    /* number of codes at each bit length for an optimal tree */

    //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
    this.heap = new Uint16Array(2 * L_CODES + 1); /* heap used to build the Huffman trees */
    zero(this.heap);
    this.heap_len = 0; /* number of elements in the heap */
    this.heap_max = 0; /* element of largest frequency */
    /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
     * The same heap array is used to build all trees.
     */

    this.depth = new Uint16Array(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
    zero(this.depth);
    /* Depth of each subtree used as tie breaker for trees of equal frequency
     */

    this.sym_buf = 0; /* buffer for distances and literals/lengths */

    this.lit_bufsize = 0;
    /* Size of match buffer for literals/lengths.  There are 4 reasons for
     * limiting lit_bufsize to 64K:
     *   - frequencies can be kept in 16 bit counters
     *   - if compression is not successful for the first block, all input
     *     data is still in the window so we can still emit a stored block even
     *     when input comes from standard input.  (This can also be done for
     *     all blocks if lit_bufsize is not greater than 32K.)
     *   - if compression is not successful for a file smaller than 64K, we can
     *     even emit a stored file instead of a stored block (saving 5 bytes).
     *     This is applicable only for zip (not gzip or zlib).
     *   - creating new Huffman trees less frequently may not provide fast
     *     adaptation to changes in the input data statistics. (Take for
     *     example a binary file with poorly compressible code followed by
     *     a highly compressible string table.) Smaller buffer sizes give
     *     fast adaptation but have of course the overhead of transmitting
     *     trees more frequently.
     *   - I can't count above 4
     */

    this.sym_next = 0; /* running index in sym_buf */
    this.sym_end = 0; /* symbol table full when sym_next reaches this */

    this.opt_len = 0; /* bit length of current block with optimal trees */
    this.static_len = 0; /* bit length of current block with static trees */
    this.matches = 0; /* number of string matches in current block */
    this.insert = 0; /* bytes at end of window left to insert */

    this.bi_buf = 0;
    /* Output buffer. bits are inserted starting at the bottom (least
     * significant bits).
     */
    this.bi_valid = 0;
    /* Number of valid bits in bi_buf.  All bits above the last valid bit
     * are always zero.
     */

    // Used for window memory init. We safely ignore it for JS. That makes
    // sense only for pointers and memory check tools.
    //this.high_water = 0;
    /* High water mark offset in window for initialized bytes -- bytes above
     * this are set to zero in order to avoid memory check warnings when
     * longest match routines access bytes past the input.  This is then
     * updated to the new high water mark.
     */
  }

  /* =========================================================================
   * Check for a valid deflate stream state. Return 0 if ok, 1 if not.
   */
  var deflateStateCheck = function deflateStateCheck(strm) {
    if (!strm) {
      return 1;
    }
    var s = strm.state;
    if (!s || s.strm !== strm || s.status !== INIT_STATE &&
    //#ifdef GZIP
    s.status !== GZIP_STATE &&
    //#endif
    s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) {
      return 1;
    }
    return 0;
  };
  var deflateResetKeep = function deflateResetKeep(strm) {
    if (deflateStateCheck(strm)) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    strm.total_in = strm.total_out = 0;
    strm.data_type = Z_UNKNOWN;
    var s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) {
      s.wrap = -s.wrap;
      /* was made negative by deflate(..., Z_FINISH); */
    }

    s.status =
    //#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE :
    //#endif
    s.wrap ? INIT_STATE : BUSY_STATE;
    strm.adler = s.wrap === 2 ? 0 // crc32(0, Z_NULL, 0)
    : 1; // adler32(0, Z_NULL, 0)
    s.last_flush = -2;
    _tr_init(s);
    return Z_OK$3;
  };
  var deflateReset = function deflateReset(strm) {
    var ret = deflateResetKeep(strm);
    if (ret === Z_OK$3) {
      lm_init(strm.state);
    }
    return ret;
  };
  var deflateSetHeader = function deflateSetHeader(strm, head) {
    if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
      return Z_STREAM_ERROR$2;
    }
    strm.state.gzhead = head;
    return Z_OK$3;
  };
  var deflateInit2 = function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
    if (!strm) {
      // === Z_NULL
      return Z_STREAM_ERROR$2;
    }
    var wrap = 1;
    if (level === Z_DEFAULT_COMPRESSION$1) {
      level = 6;
    }
    if (windowBits < 0) {
      /* suppress zlib wrapper */
      wrap = 0;
      windowBits = -windowBits;
    } else if (windowBits > 15) {
      wrap = 2; /* write gzip wrapper instead */
      windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || windowBits === 8 && wrap !== 1) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    if (windowBits === 8) {
      windowBits = 9;
    }
    /* until 256-byte window bug fixed */

    var s = new DeflateState();
    strm.state = s;
    s.strm = strm;
    s.status = INIT_STATE; /* to pass state test in deflateReset() */

    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
    s.window = new Uint8Array(s.w_size * 2);
    s.head = new Uint16Array(s.hash_size);
    s.prev = new Uint16Array(s.w_size);

    // Don't need mem init magic for JS.
    //s.high_water = 0;  /* nothing written to s->window yet */

    s.lit_bufsize = 1 << memLevel + 6; /* 16K elements by default */

    /* We overlay pending_buf and sym_buf. This works since the average size
     * for length/distance pairs over any compressed block is assured to be 31
     * bits or less.
     *
     * Analysis: The longest fixed codes are a length code of 8 bits plus 5
     * extra bits, for lengths 131 to 257. The longest fixed distance codes are
     * 5 bits plus 13 extra bits, for distances 16385 to 32768. The longest
     * possible fixed-codes length/distance pair is then 31 bits total.
     *
     * sym_buf starts one-fourth of the way into pending_buf. So there are
     * three bytes in sym_buf for every four bytes in pending_buf. Each symbol
     * in sym_buf is three bytes -- two for the distance and one for the
     * literal/length. As each symbol is consumed, the pointer to the next
     * sym_buf value to read moves forward three bytes. From that symbol, up to
     * 31 bits are written to pending_buf. The closest the written pending_buf
     * bits gets to the next sym_buf symbol to read is just before the last
     * code is written. At that time, 31*(n-2) bits have been written, just
     * after 24*(n-2) bits have been consumed from sym_buf. sym_buf starts at
     * 8*n bits into pending_buf. (Note that the symbol buffer fills when n-1
     * symbols are written.) The closest the writing gets to what is unread is
     * then n+14 bits. Here n is lit_bufsize, which is 16384 by default, and
     * can range from 128 to 32768.
     *
     * Therefore, at a minimum, there are 142 bits of space between what is
     * written and what is read in the overlain buffers, so the symbols cannot
     * be overwritten by the compressed data. That space is actually 139 bits,
     * due to the three-bit fixed-code block header.
     *
     * That covers the case where either Z_FIXED is specified, forcing fixed
     * codes, or when the use of fixed codes is chosen, because that choice
     * results in a smaller compressed block than dynamic codes. That latter
     * condition then assures that the above analysis also covers all dynamic
     * blocks. A dynamic-code block will only be chosen to be emitted if it has
     * fewer bits than a fixed-code block would for the same set of symbols.
     * Therefore its average symbol length is assured to be less than 31. So
     * the compressed data for a dynamic block also cannot overwrite the
     * symbols from which it is being constructed.
     */

    s.pending_buf_size = s.lit_bufsize * 4;
    s.pending_buf = new Uint8Array(s.pending_buf_size);

    // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
    //s->sym_buf = s->pending_buf + s->lit_bufsize;
    s.sym_buf = s.lit_bufsize;

    //s->sym_end = (s->lit_bufsize - 1) * 3;
    s.sym_end = (s.lit_bufsize - 1) * 3;
    /* We avoid equality with lit_bufsize*3 because of wraparound at 64K
     * on 16 bit machines and because stored blocks are restricted to
     * 64K-1 bytes.
     */

    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return deflateReset(strm);
  };
  var deflateInit = function deflateInit(strm, level) {
    return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
  };

  /* ========================================================================= */
  var deflate$2 = function deflate(strm, flush) {
    if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
      return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
    }
    var s = strm.state;
    if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH$3) {
      return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
    }
    var old_flush = s.last_flush;
    s.last_flush = flush;

    /* Flush as much pending output as possible */
    if (s.pending !== 0) {
      flush_pending(strm);
      if (strm.avail_out === 0) {
        /* Since avail_out is 0, deflate will be called again with
         * more output space, but possibly with both pending and
         * avail_in equal to zero. There won't be anything to do,
         * but this is not an error situation so make sure we
         * return OK instead of BUF_ERROR at next call of deflate:
         */
        s.last_flush = -1;
        return Z_OK$3;
      }

      /* Make sure there is something to do and avoid duplicate consecutive
       * flushes. For repeated and useless calls with Z_FINISH, we keep
       * returning Z_STREAM_END instead of Z_BUF_ERROR.
       */
    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$3) {
      return err(strm, Z_BUF_ERROR$1);
    }

    /* User must not provide more input after the first FINISH: */
    if (s.status === FINISH_STATE && strm.avail_in !== 0) {
      return err(strm, Z_BUF_ERROR$1);
    }

    /* Write the header */
    if (s.status === INIT_STATE && s.wrap === 0) {
      s.status = BUSY_STATE;
    }
    if (s.status === INIT_STATE) {
      /* zlib header */
      var header = Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;
      var level_flags = -1;
      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= level_flags << 6;
      if (s.strstart !== 0) {
        header |= PRESET_DICT;
      }
      header += 31 - header % 31;
      putShortMSB(s, header);

      /* Save the adler32 of the preset dictionary: */
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 0xffff);
      }
      strm.adler = 1; // adler32(0L, Z_NULL, 0);
      s.status = BUSY_STATE;

      /* Compression must start with an empty pending buffer */
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    //#ifdef GZIP
    if (s.status === GZIP_STATE) {
      /* gzip header */
      strm.adler = 0; //crc32(0L, Z_NULL, 0);
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) {
        // s->gzhead == Z_NULL
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;

        /* Compression must start with an empty pending buffer */
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      } else {
        put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, s.gzhead.time >> 8 & 0xff);
        put_byte(s, s.gzhead.time >> 16 & 0xff);
        put_byte(s, s.gzhead.time >> 24 & 0xff);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, s.gzhead.os & 0xff);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, s.gzhead.extra.length >> 8 & 0xff);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    if (s.status === EXTRA_STATE) {
      if (s.gzhead.extra /* != Z_NULL*/) {
        var beg = s.pending; /* start of bytes to update crc */
        var left = (s.gzhead.extra.length & 0xffff) - s.gzindex;
        while (s.pending + left > s.pending_buf_size) {
          var copy = s.pending_buf_size - s.pending;
          // zmemcpy(s.pending_buf + s.pending,
          //    s.gzhead.extra + s.gzindex, copy);
          s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
          s.pending = s.pending_buf_size;
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          s.gzindex += copy;
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
          left -= copy;
        }
        // JS specific: s.gzhead.extra may be TypedArray or Array for backward compatibility
        //              TypedArray.slice and TypedArray.from don't exist in IE10-IE11
        var gzhead_extra = new Uint8Array(s.gzhead.extra);
        // zmemcpy(s->pending_buf + s->pending,
        //     s->gzhead->extra + s->gzindex, left);
        s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
        s.pending += left;
        //--- HCRC_UPDATE(beg) ---//
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        //---//
        s.gzindex = 0;
      }
      s.status = NAME_STATE;
    }
    if (s.status === NAME_STATE) {
      if (s.gzhead.name /* != Z_NULL*/) {
        var _beg = s.pending; /* start of bytes to update crc */
        var val;
        do {
          if (s.pending === s.pending_buf_size) {
            //--- HCRC_UPDATE(beg) ---//
            if (s.gzhead.hcrc && s.pending > _beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - _beg, _beg);
            }
            //---//
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            _beg = 0;
          }
          // JS specific: little magic to add zero terminator to end of string
          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        //--- HCRC_UPDATE(beg) ---//
        if (s.gzhead.hcrc && s.pending > _beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - _beg, _beg);
        }
        //---//
        s.gzindex = 0;
      }
      s.status = COMMENT_STATE;
    }
    if (s.status === COMMENT_STATE) {
      if (s.gzhead.comment /* != Z_NULL*/) {
        var _beg2 = s.pending; /* start of bytes to update crc */
        var _val;
        do {
          if (s.pending === s.pending_buf_size) {
            //--- HCRC_UPDATE(beg) ---//
            if (s.gzhead.hcrc && s.pending > _beg2) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - _beg2, _beg2);
            }
            //---//
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            _beg2 = 0;
          }
          // JS specific: little magic to add zero terminator to end of string
          if (s.gzindex < s.gzhead.comment.length) {
            _val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
          } else {
            _val = 0;
          }
          put_byte(s, _val);
        } while (_val !== 0);
        //--- HCRC_UPDATE(beg) ---//
        if (s.gzhead.hcrc && s.pending > _beg2) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - _beg2, _beg2);
        }
        //---//
      }

      s.status = HCRC_STATE;
    }
    if (s.status === HCRC_STATE) {
      if (s.gzhead.hcrc) {
        if (s.pending + 2 > s.pending_buf_size) {
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
        }
        put_byte(s, strm.adler & 0xff);
        put_byte(s, strm.adler >> 8 & 0xff);
        strm.adler = 0; //crc32(0L, Z_NULL, 0);
      }

      s.status = BUSY_STATE;

      /* Compression must start with an empty pending buffer */
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    //#endif

    /* Start a new block or continue the current one.
     */
    if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE) {
      var bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
        s.status = FINISH_STATE;
      }
      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          /* avoid BUF_ERROR next call, see above */
        }

        return Z_OK$3;
        /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
         * of deflate should use the same flush parameter to make sure
         * that the flush is complete. So we don't have to output an
         * empty block here, this will be done at next call. This also
         * ensures that for a very small output buffer, we emit at most
         * one empty block.
         */
      }

      if (bstate === BS_BLOCK_DONE) {
        if (flush === Z_PARTIAL_FLUSH) {
          _tr_align(s);
        } else if (flush !== Z_BLOCK$1) {
          /* FULL_FLUSH or SYNC_FLUSH */

          _tr_stored_block(s, 0, 0, false);
          /* For a full flush, this empty block will be recognized
           * as a special marker by inflate_sync().
           */
          if (flush === Z_FULL_FLUSH$1) {
            /*** CLEAR_HASH(s); ***/ /* forget history */
            zero(s.head); // Fill with NIL (= 0);

            if (s.lookahead === 0) {
              s.strstart = 0;
              s.block_start = 0;
              s.insert = 0;
            }
          }
        }
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
          return Z_OK$3;
        }
      }
    }
    if (flush !== Z_FINISH$3) {
      return Z_OK$3;
    }
    if (s.wrap <= 0) {
      return Z_STREAM_END$3;
    }

    /* Write the trailer */
    if (s.wrap === 2) {
      put_byte(s, strm.adler & 0xff);
      put_byte(s, strm.adler >> 8 & 0xff);
      put_byte(s, strm.adler >> 16 & 0xff);
      put_byte(s, strm.adler >> 24 & 0xff);
      put_byte(s, strm.total_in & 0xff);
      put_byte(s, strm.total_in >> 8 & 0xff);
      put_byte(s, strm.total_in >> 16 & 0xff);
      put_byte(s, strm.total_in >> 24 & 0xff);
    } else {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 0xffff);
    }
    flush_pending(strm);
    /* If avail_out is zero, the application will call deflate again
     * to flush the rest.
     */
    if (s.wrap > 0) {
      s.wrap = -s.wrap;
    }
    /* write the trailer only once! */
    return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
  };
  var deflateEnd = function deflateEnd(strm) {
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    var status = strm.state.status;
    strm.state = null;
    return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
  };

  /* =========================================================================
   * Initializes the compression dictionary from the given byte
   * sequence without producing any compressed output.
   */
  var deflateSetDictionary = function deflateSetDictionary(strm, dictionary) {
    var dictLength = dictionary.length;
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    var s = strm.state;
    var wrap = s.wrap;
    if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
      return Z_STREAM_ERROR$2;
    }

    /* when using zlib wrappers, compute Adler-32 for provided dictionary */
    if (wrap === 1) {
      /* adler32(strm->adler, dictionary, dictLength); */
      strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
    }
    s.wrap = 0; /* avoid computing Adler-32 in read_buf */

    /* if dictionary would fill window, just replace the history */
    if (dictLength >= s.w_size) {
      if (wrap === 0) {
        /* already empty otherwise */
        /*** CLEAR_HASH(s); ***/
        zero(s.head); // Fill with NIL (= 0);
        s.strstart = 0;
        s.block_start = 0;
        s.insert = 0;
      }
      /* use the tail */
      // dictionary = dictionary.slice(dictLength - s.w_size);
      var tmpDict = new Uint8Array(s.w_size);
      tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
      dictionary = tmpDict;
      dictLength = s.w_size;
    }
    /* insert dictionary into window and hash */
    var avail = strm.avail_in;
    var next = strm.next_in;
    var input = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    fill_window(s);
    while (s.lookahead >= MIN_MATCH) {
      var str = s.strstart;
      var n = s.lookahead - (MIN_MATCH - 1);
      do {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
      } while (--n);
      s.strstart = str;
      s.lookahead = MIN_MATCH - 1;
      fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input;
    strm.avail_in = avail;
    s.wrap = wrap;
    return Z_OK$3;
  };
  var deflateInit_1 = deflateInit;
  var deflateInit2_1 = deflateInit2;
  var deflateReset_1 = deflateReset;
  var deflateResetKeep_1 = deflateResetKeep;
  var deflateSetHeader_1 = deflateSetHeader;
  var deflate_2$1 = deflate$2;
  var deflateEnd_1 = deflateEnd;
  var deflateSetDictionary_1 = deflateSetDictionary;
  var deflateInfo = 'pako deflate (from Nodeca project)';

  /* Not implemented
  module.exports.deflateBound = deflateBound;
  module.exports.deflateCopy = deflateCopy;
  module.exports.deflateGetDictionary = deflateGetDictionary;
  module.exports.deflateParams = deflateParams;
  module.exports.deflatePending = deflatePending;
  module.exports.deflatePrime = deflatePrime;
  module.exports.deflateTune = deflateTune;
  */

  var deflate_1$2 = {
    deflateInit: deflateInit_1,
    deflateInit2: deflateInit2_1,
    deflateReset: deflateReset_1,
    deflateResetKeep: deflateResetKeep_1,
    deflateSetHeader: deflateSetHeader_1,
    deflate: deflate_2$1,
    deflateEnd: deflateEnd_1,
    deflateSetDictionary: deflateSetDictionary_1,
    deflateInfo: deflateInfo
  };

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  var _has = function _has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
  var assign = function assign(obj /*from1, from2, from3, ...*/) {
    var sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      var source = sources.shift();
      if (!source) {
        continue;
      }
      if (_typeof(source) !== 'object') {
        throw new TypeError(source + 'must be non-object');
      }
      for (var p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }
    return obj;
  };

  // Join array of chunks to single array.
  var flattenChunks = function flattenChunks(chunks) {
    // calculate data length
    var len = 0;
    for (var i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    var result = new Uint8Array(len);
    for (var _i = 0, pos = 0, _l = chunks.length; _i < _l; _i++) {
      var chunk = chunks[_i];
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  };
  var common = {
    assign: assign,
    flattenChunks: flattenChunks
  };

  // String encode/decode helpers

  // Quick check if we can use fast array to bin string conversion
  //
  // - apply(Array) can fail on Android 2.2
  // - apply(Uint8Array) can fail on iOS 5.1 Safari
  //
  var STR_APPLY_UIA_OK = true;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (__) {
    STR_APPLY_UIA_OK = false;
  }

  // Table with utf8 lengths (calculated by first byte of sequence)
  // Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
  // because max possible codepoint is 0x10ffff
  var _utf8len = new Uint8Array(256);
  for (var q = 0; q < 256; q++) {
    _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
  }
  _utf8len[254] = _utf8len[254] = 1; // Invalid sequence start

  // convert string to array (typed, when possible)
  var string2buf = function string2buf(str) {
    if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) {
      return new TextEncoder().encode(str);
    }
    var buf,
      c,
      c2,
      m_pos,
      i,
      str_len = str.length,
      buf_len = 0;

    // count binary size
    for (m_pos = 0; m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 0xfc00) === 0xdc00) {
          c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
          m_pos++;
        }
      }
      buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
    }

    // allocate buffer
    buf = new Uint8Array(buf_len);

    // convert
    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 0xfc00) === 0xdc00) {
          c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
          m_pos++;
        }
      }
      if (c < 0x80) {
        /* one byte */
        buf[i++] = c;
      } else if (c < 0x800) {
        /* two bytes */
        buf[i++] = 0xC0 | c >>> 6;
        buf[i++] = 0x80 | c & 0x3f;
      } else if (c < 0x10000) {
        /* three bytes */
        buf[i++] = 0xE0 | c >>> 12;
        buf[i++] = 0x80 | c >>> 6 & 0x3f;
        buf[i++] = 0x80 | c & 0x3f;
      } else {
        /* four bytes */
        buf[i++] = 0xf0 | c >>> 18;
        buf[i++] = 0x80 | c >>> 12 & 0x3f;
        buf[i++] = 0x80 | c >>> 6 & 0x3f;
        buf[i++] = 0x80 | c & 0x3f;
      }
    }
    return buf;
  };

  // Helper
  var buf2binstring = function buf2binstring(buf, len) {
    // On Chrome, the arguments in a function call that are allowed is `65534`.
    // If the length of the buffer is smaller than that, we can use this optimization,
    // otherwise we will take a slower path.
    if (len < 65534) {
      if (buf.subarray && STR_APPLY_UIA_OK) {
        return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
      }
    }
    var result = '';
    for (var i = 0; i < len; i++) {
      result += String.fromCharCode(buf[i]);
    }
    return result;
  };

  // convert array to string
  var buf2string = function buf2string(buf, max) {
    var len = max || buf.length;
    if (typeof TextDecoder === 'function' && TextDecoder.prototype.decode) {
      return new TextDecoder().decode(buf.subarray(0, max));
    }
    var i, out;

    // Reserve max possible length (2 words per char)
    // NB: by unknown reasons, Array is significantly faster for
    //     String.fromCharCode.apply than Uint16Array.
    var utf16buf = new Array(len * 2);
    for (out = 0, i = 0; i < len;) {
      var c = buf[i++];
      // quick process ascii
      if (c < 0x80) {
        utf16buf[out++] = c;
        continue;
      }
      var c_len = _utf8len[c];
      // skip 5 & 6 byte codes
      if (c_len > 4) {
        utf16buf[out++] = 0xfffd;
        i += c_len - 1;
        continue;
      }

      // apply mask on first byte
      c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
      // join the rest
      while (c_len > 1 && i < len) {
        c = c << 6 | buf[i++] & 0x3f;
        c_len--;
      }

      // terminated by end of string?
      if (c_len > 1) {
        utf16buf[out++] = 0xfffd;
        continue;
      }
      if (c < 0x10000) {
        utf16buf[out++] = c;
      } else {
        c -= 0x10000;
        utf16buf[out++] = 0xd800 | c >> 10 & 0x3ff;
        utf16buf[out++] = 0xdc00 | c & 0x3ff;
      }
    }
    return buf2binstring(utf16buf, out);
  };

  // Calculate max possible position in utf8 buffer,
  // that will not break sequence. If that's not possible
  // - (very small limits) return max size as is.
  //
  // buf[] - utf8 bytes array
  // max   - length limit (mandatory);
  var utf8border = function utf8border(buf, max) {
    max = max || buf.length;
    if (max > buf.length) {
      max = buf.length;
    }

    // go back from last position, until start of sequence found
    var pos = max - 1;
    while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) {
      pos--;
    }

    // Very small and broken sequence,
    // return max, because we should return something anyway.
    if (pos < 0) {
      return max;
    }

    // If we came to start of buffer - that means buffer is too small,
    // return max too.
    if (pos === 0) {
      return max;
    }
    return pos + _utf8len[buf[pos]] > max ? pos : max;
  };
  var strings = {
    string2buf: string2buf,
    buf2string: buf2string,
    utf8border: utf8border
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.
  function ZStream() {
    /* next input byte */
    this.input = null; // JS specific, because we have no pointers
    this.next_in = 0;
    /* number of bytes available at input */
    this.avail_in = 0;
    /* total number of input bytes read so far */
    this.total_in = 0;
    /* next output byte should be put there */
    this.output = null; // JS specific, because we have no pointers
    this.next_out = 0;
    /* remaining free space at output */
    this.avail_out = 0;
    /* total number of bytes output so far */
    this.total_out = 0;
    /* last error message, NULL if no error */
    this.msg = '' /*Z_NULL*/;
    /* not visible by applications */
    this.state = null;
    /* best guess about the data type: binary or text */
    this.data_type = 2 /*Z_UNKNOWN*/;
    /* adler32 value of the uncompressed data */
    this.adler = 0;
  }
  var zstream = ZStream;

  var toString$1 = Object.prototype.toString;

  /* Public constants ==========================================================*/
  /* ===========================================================================*/

  var Z_NO_FLUSH$1 = constants$2.Z_NO_FLUSH,
    Z_SYNC_FLUSH = constants$2.Z_SYNC_FLUSH,
    Z_FULL_FLUSH = constants$2.Z_FULL_FLUSH,
    Z_FINISH$2 = constants$2.Z_FINISH,
    Z_OK$2 = constants$2.Z_OK,
    Z_STREAM_END$2 = constants$2.Z_STREAM_END,
    Z_DEFAULT_COMPRESSION = constants$2.Z_DEFAULT_COMPRESSION,
    Z_DEFAULT_STRATEGY = constants$2.Z_DEFAULT_STRATEGY,
    Z_DEFLATED$1 = constants$2.Z_DEFLATED;

  /* ===========================================================================*/

  /**
   * class Deflate
   *
   * Generic JS-style wrapper for zlib calls. If you don't need
   * streaming behaviour - use more simple functions: [[deflate]],
   * [[deflateRaw]] and [[gzip]].
   **/

  /* internal
   * Deflate.chunks -> Array
   *
   * Chunks of output data, if [[Deflate#onData]] not overridden.
   **/

  /**
   * Deflate.result -> Uint8Array
   *
   * Compressed result, generated by default [[Deflate#onData]]
   * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
   * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
   **/

  /**
   * Deflate.err -> Number
   *
   * Error code after deflate finished. 0 (Z_OK) on success.
   * You will not need it in real life, because deflate errors
   * are possible only on wrong options or bad `onData` / `onEnd`
   * custom handlers.
   **/

  /**
   * Deflate.msg -> String
   *
   * Error message, if [[Deflate.err]] != 0
   **/

  /**
   * new Deflate(options)
   * - options (Object): zlib deflate options.
   *
   * Creates new deflator instance with specified params. Throws exception
   * on bad params. Supported options:
   *
   * - `level`
   * - `windowBits`
   * - `memLevel`
   * - `strategy`
   * - `dictionary`
   *
   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
   * for more information on these.
   *
   * Additional options, for internal needs:
   *
   * - `chunkSize` - size of generated data chunks (16K by default)
   * - `raw` (Boolean) - do raw deflate
   * - `gzip` (Boolean) - create gzip wrapper
   * - `header` (Object) - custom header for gzip
   *   - `text` (Boolean) - true if compressed data believed to be text
   *   - `time` (Number) - modification time, unix timestamp
   *   - `os` (Number) - operation system code
   *   - `extra` (Array) - array of bytes with extra data (max 65536)
   *   - `name` (String) - file name (binary string)
   *   - `comment` (String) - comment (binary string)
   *   - `hcrc` (Boolean) - true if header crc should be added
   *
   * ##### Example:
   *
   * ```javascript
   * const pako = require('pako')
   *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
   *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
   *
   * const deflate = new pako.Deflate({ level: 3});
   *
   * deflate.push(chunk1, false);
   * deflate.push(chunk2, true);  // true -> last chunk
   *
   * if (deflate.err) { throw new Error(deflate.err); }
   *
   * console.log(deflate.result);
   * ```
   **/
  function Deflate$1(options) {
    this.options = common.assign({
      level: Z_DEFAULT_COMPRESSION,
      method: Z_DEFLATED$1,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: Z_DEFAULT_STRATEGY
    }, options || {});
    var opt = this.options;
    if (opt.raw && opt.windowBits > 0) {
      opt.windowBits = -opt.windowBits;
    } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
      opt.windowBits += 16;
    }
    this.err = 0; // error code, if happens (0 = Z_OK)
    this.msg = ''; // error message
    this.ended = false; // used to avoid multiple onEnd() calls
    this.chunks = []; // chunks of compressed data

    this.strm = new zstream();
    this.strm.avail_out = 0;
    var status = deflate_1$2.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy);
    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }
    if (opt.header) {
      deflate_1$2.deflateSetHeader(this.strm, opt.header);
    }
    if (opt.dictionary) {
      var dict;
      // Convert data if needed
      if (typeof opt.dictionary === 'string') {
        // If we need to compress text, change encoding to utf8.
        dict = strings.string2buf(opt.dictionary);
      } else if (toString$1.call(opt.dictionary) === '[object ArrayBuffer]') {
        dict = new Uint8Array(opt.dictionary);
      } else {
        dict = opt.dictionary;
      }
      status = deflate_1$2.deflateSetDictionary(this.strm, dict);
      if (status !== Z_OK$2) {
        throw new Error(messages[status]);
      }
      this._dict_set = true;
    }
  }

  /**
   * Deflate#push(data[, flush_mode]) -> Boolean
   * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
   *   converted to utf8 byte sequence.
   * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
   *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
   *
   * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
   * new compressed chunks. Returns `true` on success. The last data block must
   * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
   * buffers and call [[Deflate#onEnd]].
   *
   * On fail call [[Deflate#onEnd]] with error code and return false.
   *
   * ##### Example
   *
   * ```javascript
   * push(chunk, false); // push one of data chunks
   * ...
   * push(chunk, true);  // push last chunk
   * ```
   **/
  Deflate$1.prototype.push = function (data, flush_mode) {
    var strm = this.strm;
    var chunkSize = this.options.chunkSize;
    var status, _flush_mode;
    if (this.ended) {
      return false;
    }
    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;

    // Convert data if needed
    if (typeof data === 'string') {
      // If we need to compress text, change encoding to utf8.
      strm.input = strings.string2buf(data);
    } else if (toString$1.call(data) === '[object ArrayBuffer]') {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (;;) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }

      // Make sure avail_out > 6 to avoid repeating markers
      if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      status = deflate_1$2.deflate(strm, _flush_mode);

      // Ended => flush and finish
      if (status === Z_STREAM_END$2) {
        if (strm.next_out > 0) {
          this.onData(strm.output.subarray(0, strm.next_out));
        }
        status = deflate_1$2.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK$2;
      }

      // Flush if out buffer full
      if (strm.avail_out === 0) {
        this.onData(strm.output);
        continue;
      }

      // Flush if requested and has data
      if (_flush_mode > 0 && strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      if (strm.avail_in === 0) break;
    }
    return true;
  };

  /**
   * Deflate#onData(chunk) -> Void
   * - chunk (Uint8Array): output data.
   *
   * By default, stores data blocks in `chunks[]` property and glue
   * those in `onEnd`. Override this handler, if you need another behaviour.
   **/
  Deflate$1.prototype.onData = function (chunk) {
    this.chunks.push(chunk);
  };

  /**
   * Deflate#onEnd(status) -> Void
   * - status (Number): deflate status. 0 (Z_OK) on success,
   *   other if not.
   *
   * Called once after you tell deflate that the input stream is
   * complete (Z_FINISH). By default - join collected chunks,
   * free memory and fill `results` / `err` properties.
   **/
  Deflate$1.prototype.onEnd = function (status) {
    // On success - join
    if (status === Z_OK$2) {
      this.result = common.flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };

  /**
   * deflate(data[, options]) -> Uint8Array
   * - data (Uint8Array|ArrayBuffer|String): input data to compress.
   * - options (Object): zlib deflate options.
   *
   * Compress `data` with deflate algorithm and `options`.
   *
   * Supported options are:
   *
   * - level
   * - windowBits
   * - memLevel
   * - strategy
   * - dictionary
   *
   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
   * for more information on these.
   *
   * Sugar (options):
   *
   * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
   *   negative windowBits implicitly.
   *
   * ##### Example:
   *
   * ```javascript
   * const pako = require('pako')
   * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
   *
   * console.log(pako.deflate(data));
   * ```
   **/
  function deflate$1(input, options) {
    var deflator = new Deflate$1(options);
    deflator.push(input, true);

    // That will never happens, if you don't cheat with options :)
    if (deflator.err) {
      throw deflator.msg || messages[deflator.err];
    }
    return deflator.result;
  }

  /**
   * deflateRaw(data[, options]) -> Uint8Array
   * - data (Uint8Array|ArrayBuffer|String): input data to compress.
   * - options (Object): zlib deflate options.
   *
   * The same as [[deflate]], but creates raw data, without wrapper
   * (header and adler32 crc).
   **/
  function deflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return deflate$1(input, options);
  }

  /**
   * gzip(data[, options]) -> Uint8Array
   * - data (Uint8Array|ArrayBuffer|String): input data to compress.
   * - options (Object): zlib deflate options.
   *
   * The same as [[deflate]], but create gzip wrapper instead of
   * deflate one.
   **/
  function gzip$1(input, options) {
    options = options || {};
    options.gzip = true;
    return deflate$1(input, options);
  }
  var Deflate_1$1 = Deflate$1;
  var deflate_2 = deflate$1;
  var deflateRaw_1$1 = deflateRaw$1;
  var gzip_1$1 = gzip$1;
  var constants$1 = constants$2;
  var deflate_1$1 = {
    Deflate: Deflate_1$1,
    deflate: deflate_2,
    deflateRaw: deflateRaw_1$1,
    gzip: gzip_1$1,
    constants: constants$1
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  // See state defs from inflate.js
  var BAD$1 = 16209; /* got a data error -- remain here until reset */
  var TYPE$1 = 16191; /* i: waiting for type bits, including last-flag bit */

  /*
     Decode literal, length, and distance codes and write out the resulting
     literal and match bytes until either not enough input or output is
     available, an end-of-block is encountered, or a data error is encountered.
     When large enough input and output buffers are supplied to inflate(), for
     example, a 16K input buffer and a 64K output buffer, more than 95% of the
     inflate execution time is spent in this routine.

     Entry assumptions:

          state.mode === LEN
          strm.avail_in >= 6
          strm.avail_out >= 258
          start >= strm.avail_out
          state.bits < 8

     On return, state.mode is one of:

          LEN -- ran out of enough output space or enough available input
          TYPE -- reached end of block code, inflate() to interpret next block
          BAD -- error in block data

     Notes:

      - The maximum input bits used by a length/distance pair is 15 bits for the
        length code, 5 bits for the length extra, 15 bits for the distance code,
        and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
        Therefore if strm.avail_in >= 6, then there is enough input to avoid
        checking for available input while decoding.

      - The maximum bytes that a single length/distance pair can output is 258
        bytes, which is the maximum length that can be coded.  inflate_fast()
        requires strm.avail_out >= 258 for each loop to avoid checking for
        output space.
   */
  var inffast = function inflate_fast(strm, start) {
    var _in; /* local strm.input */
    var last; /* have enough input while in < last */
    var _out; /* local strm.output */
    var beg; /* inflate()'s initial strm.output */
    var end; /* while out < end, enough space available */
    //#ifdef INFLATE_STRICT
    var dmax; /* maximum distance from zlib header */
    //#endif
    var wsize; /* window size or zero if not using window */
    var whave; /* valid bytes in the window */
    var wnext; /* window write index */
    // Use `s_window` instead `window`, avoid conflict with instrumentation tools
    var s_window; /* allocated sliding window, if wsize != 0 */
    var hold; /* local strm.hold */
    var bits; /* local strm.bits */
    var lcode; /* local strm.lencode */
    var dcode; /* local strm.distcode */
    var lmask; /* mask for first level of length codes */
    var dmask; /* mask for first level of distance codes */
    var here; /* retrieved table entry */
    var op; /* code bits, operation, extra bits, or */
    /*  window position, window bytes to copy */
    var len; /* match length, unused bytes */
    var dist; /* match distance */
    var from; /* where to copy match from */
    var from_source;
    var input, output; // JS specific, because we have no pointers

    /* copy state to local variables */
    var state = strm.state;
    //here = state.here;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    //#ifdef INFLATE_STRICT
    dmax = state.dmax;
    //#endif
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;

    /* decode literals and length/distances until end-of-block or not enough
       input data or output space */

    top: do {
      if (bits < 15) {
        hold += input[_in++] << bits;
        bits += 8;
        hold += input[_in++] << bits;
        bits += 8;
      }
      here = lcode[hold & lmask];
      dolen: for (;;) {
        // Goto emulation
        op = here >>> 24 /*here.bits*/;
        hold >>>= op;
        bits -= op;
        op = here >>> 16 & 0xff /*here.op*/;
        if (op === 0) {
          /* literal */
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          output[_out++] = here & 0xffff /*here.val*/;
        } else if (op & 16) {
          /* length base */
          len = here & 0xffff /*here.val*/;
          op &= 15; /* number of extra bits */
          if (op) {
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
            }
            len += hold & (1 << op) - 1;
            hold >>>= op;
            bits -= op;
          }
          //Tracevv((stderr, "inflate:         length %u\n", len));
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = dcode[hold & dmask];
          dodist: for (;;) {
            // goto emulation
            op = here >>> 24 /*here.bits*/;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 0xff /*here.op*/;

            if (op & 16) {
              /* distance base */
              dist = here & 0xffff /*here.val*/;
              op &= 15; /* number of extra bits */
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
              }
              dist += hold & (1 << op) - 1;
              //#ifdef INFLATE_STRICT
              if (dist > dmax) {
                strm.msg = 'invalid distance too far back';
                state.mode = BAD$1;
                break top;
              }
              //#endif
              hold >>>= op;
              bits -= op;
              //Tracevv((stderr, "inflate:         distance %u\n", dist));
              op = _out - beg; /* max distance in output */
              if (dist > op) {
                /* see if copy from window */
                op = dist - op; /* distance back in window */
                if (op > whave) {
                  if (state.sane) {
                    strm.msg = 'invalid distance too far back';
                    state.mode = BAD$1;
                    break top;
                  }

                  // (!) This block is disabled in zlib defaults,
                  // don't enable it for binary compatibility
                  //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
                  //                if (len <= op - whave) {
                  //                  do {
                  //                    output[_out++] = 0;
                  //                  } while (--len);
                  //                  continue top;
                  //                }
                  //                len -= op - whave;
                  //                do {
                  //                  output[_out++] = 0;
                  //                } while (--op > whave);
                  //                if (op === 0) {
                  //                  from = _out - dist;
                  //                  do {
                  //                    output[_out++] = output[from++];
                  //                  } while (--len);
                  //                  continue top;
                  //                }
                  //#endif
                }

                from = 0; // window index
                from_source = s_window;
                if (wnext === 0) {
                  /* very common case */
                  from += wsize - op;
                  if (op < len) {
                    /* some from window */
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist; /* rest from output */
                    from_source = output;
                  }
                } else if (wnext < op) {
                  /* wrap around window */
                  from += wsize + wnext - op;
                  op -= wnext;
                  if (op < len) {
                    /* some from end of window */
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = 0;
                    if (wnext < len) {
                      /* some from start of window */
                      op = wnext;
                      len -= op;
                      do {
                        output[_out++] = s_window[from++];
                      } while (--op);
                      from = _out - dist; /* rest from output */
                      from_source = output;
                    }
                  }
                } else {
                  /* contiguous in window */
                  from += wnext - op;
                  if (op < len) {
                    /* some from window */
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist; /* rest from output */
                    from_source = output;
                  }
                }
                while (len > 2) {
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  len -= 3;
                }
                if (len) {
                  output[_out++] = from_source[from++];
                  if (len > 1) {
                    output[_out++] = from_source[from++];
                  }
                }
              } else {
                from = _out - dist; /* copy direct from output */
                do {
                  /* minimum length is three */
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  len -= 3;
                } while (len > 2);
                if (len) {
                  output[_out++] = output[from++];
                  if (len > 1) {
                    output[_out++] = output[from++];
                  }
                }
              }
            } else if ((op & 64) === 0) {
              /* 2nd level distance code */
              here = dcode[(here & 0xffff /*here.val*/) + (hold & (1 << op) - 1)];
              continue dodist;
            } else {
              strm.msg = 'invalid distance code';
              state.mode = BAD$1;
              break top;
            }
            break; // need to emulate goto via "continue"
          }
        } else if ((op & 64) === 0) {
          /* 2nd level length code */
          here = lcode[(here & 0xffff /*here.val*/) + (hold & (1 << op) - 1)];
          continue dolen;
        } else if (op & 32) {
          /* end-of-block */
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.mode = TYPE$1;
          break top;
        } else {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD$1;
          break top;
        }
        break; // need to emulate goto via "continue"
      }
    } while (_in < last && _out < end);

    /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;

    /* update state and return */
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.
  var MAXBITS = 15;
  var ENOUGH_LENS$1 = 852;
  var ENOUGH_DISTS$1 = 592;
  //const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

  var CODES$1 = 0;
  var LENS$1 = 1;
  var DISTS$1 = 2;
  var lbase = new Uint16Array([/* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]);
  var lext = new Uint8Array([/* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]);
  var dbase = new Uint16Array([/* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]);
  var dext = new Uint8Array([/* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]);
  var inflate_table = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
    var bits = opts.bits;
    //here = opts.here; /* table entry for duplication */

    var len = 0; /* a code's length in bits */
    var sym = 0; /* index of code symbols */
    var min = 0,
      max = 0; /* minimum and maximum code lengths */
    var root = 0; /* number of index bits for root table */
    var curr = 0; /* number of index bits for current table */
    var drop = 0; /* code bits to drop for sub-table */
    var left = 0; /* number of prefix codes available */
    var used = 0; /* code entries in table used */
    var huff = 0; /* Huffman code */
    var incr; /* for incrementing code, index */
    var fill; /* index for replicating entries */
    var low; /* low bits for current root entry */
    var mask; /* mask for low root bits */
    var next; /* next available space in table */
    var base = null; /* base value table to use */
    //  let shoextra;    /* extra bits table to use */
    var match; /* use base and extra for symbol >= match */
    var count = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
    var offs = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
    var extra = null;
    var here_bits, here_op, here_val;

    /*
     Process a set of code lengths to create a canonical Huffman code.  The
     code lengths are lens[0..codes-1].  Each length corresponds to the
     symbols 0..codes-1.  The Huffman code is generated by first sorting the
     symbols by length from short to long, and retaining the symbol order
     for codes with equal lengths.  Then the code starts with all zero bits
     for the first code of the shortest length, and the codes are integer
     increments for the same length, and zeros are appended as the length
     increases.  For the deflate format, these bits are stored backwards
     from their more natural integer increment ordering, and so when the
     decoding tables are built in the large loop below, the integer codes
     are incremented backwards.
      This routine assumes, but does not check, that all of the entries in
     lens[] are in the range 0..MAXBITS.  The caller must assure this.
     1..MAXBITS is interpreted as that code length.  zero means that that
     symbol does not occur in this code.
      The codes are sorted by computing a count of codes for each length,
     creating from that a table of starting indices for each length in the
     sorted table, and then entering the symbols in order in the sorted
     table.  The sorted table is work[], with that space being provided by
     the caller.
      The length counts are used for other purposes as well, i.e. finding
     the minimum and maximum length codes, determining if there are any
     codes at all, checking for a valid set of lengths, and looking ahead
     at length counts to determine sub-table sizes when building the
     decoding tables.
     */

    /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
    for (len = 0; len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0; sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }

    /* bound code lengths, force root to be within code lengths */
    root = bits;
    for (max = MAXBITS; max >= 1; max--) {
      if (count[max] !== 0) {
        break;
      }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {
      /* no symbols to code at all */
      //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
      //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
      //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
      table[table_index++] = 1 << 24 | 64 << 16 | 0;

      //table.op[opts.table_index] = 64;
      //table.bits[opts.table_index] = 1;
      //table.val[opts.table_index++] = 0;
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      opts.bits = 1;
      return 0; /* no symbols, but wait for decoding to report error */
    }

    for (min = 1; min < max; min++) {
      if (count[min] !== 0) {
        break;
      }
    }
    if (root < min) {
      root = min;
    }

    /* check for an over-subscribed or incomplete set of lengths */
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      } /* over-subscribed */
    }

    if (left > 0 && (type === CODES$1 || max !== 1)) {
      return -1; /* incomplete set */
    }

    /* generate offsets into symbol table for each length for sorting */
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }

    /* sort symbols by length, by symbol order within each length */
    for (sym = 0; sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }

    /*
     Create and fill in decoding tables.  In this loop, the table being
     filled is at next and has curr index bits.  The code being used is huff
     with length len.  That code is converted to an index by dropping drop
     bits off of the bottom.  For codes where len is less than drop + curr,
     those top drop + curr - len bits are incremented through all values to
     fill the table with replicated entries.
      root is the number of index bits for the root table.  When len exceeds
     root, sub-tables are created pointed to by the root entry with an index
     of the low root bits of huff.  This is saved in low to check for when a
     new sub-table should be started.  drop is zero when the root table is
     being filled, and drop is root when sub-tables are being filled.
      When a new sub-table is needed, it is necessary to look ahead in the
     code lengths to determine what size sub-table is needed.  The length
     counts are used for this, and so count[] is decremented as codes are
     entered in the tables.
      used keeps track of how many table entries have been allocated from the
     provided *table space.  It is checked for LENS and DIST tables against
     the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
     the initial root table size constants.  See the comments in inftrees.h
     for more information.
      sym increments through all symbols, and the loop terminates when
     all codes of length max, i.e. all codes, have been processed.  This
     routine permits incomplete codes, so another loop after this one fills
     in the rest of the decoding tables with invalid code markers.
     */

    /* set up for code type */
    // poor man optimization - use if-else instead of switch,
    // to avoid deopts in old v8
    if (type === CODES$1) {
      base = extra = work; /* dummy value--not used */
      match = 20;
    } else if (type === LENS$1) {
      base = lbase;
      extra = lext;
      match = 257;
    } else {
      /* DISTS */
      base = dbase;
      extra = dext;
      match = 0;
    }

    /* initialize opts for loop */
    huff = 0; /* starting code */
    sym = 0; /* starting code symbol */
    len = min; /* starting code length */
    next = table_index; /* current table to fill in */
    curr = root; /* current table index bits */
    drop = 0; /* current bits to drop from code for index */
    low = -1; /* trigger new sub-table when len > root */
    used = 1 << root; /* use root table entries */
    mask = used - 1; /* mask for comparing low */

    /* check available table space */
    if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
      return 1;
    }

    /* process all codes and make table entries */
    for (;;) {
      /* create table entry */
      here_bits = len - drop;
      if (work[sym] + 1 < match) {
        here_op = 0;
        here_val = work[sym];
      } else if (work[sym] >= match) {
        here_op = extra[work[sym] - match];
        here_val = base[work[sym] - match];
      } else {
        here_op = 32 + 64; /* end of block */
        here_val = 0;
      }

      /* replicate for those indices with low len bits equal to huff */
      incr = 1 << len - drop;
      fill = 1 << curr;
      min = fill; /* save offset to next table */
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
      } while (fill !== 0);

      /* backwards increment the len-bit code huff */
      incr = 1 << len - 1;
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }

      /* go to next symbol, update count, len */
      sym++;
      if (--count[len] === 0) {
        if (len === max) {
          break;
        }
        len = lens[lens_index + work[sym]];
      }

      /* create new sub-table if needed */
      if (len > root && (huff & mask) !== low) {
        /* if first time, transition to sub-tables */
        if (drop === 0) {
          drop = root;
        }

        /* increment past last table */
        next += min; /* here min is 1 << curr */

        /* determine length of next table */
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) {
            break;
          }
          curr++;
          left <<= 1;
        }

        /* check for enough space */
        used += 1 << curr;
        if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
          return 1;
        }

        /* point entry in root table to sub-table */
        low = huff & mask;
        /*table.op[low] = curr;
        table.bits[low] = root;
        table.val[low] = next - opts.table_index;*/
        table[low] = root << 24 | curr << 16 | next - table_index | 0;
      }
    }

    /* fill in remaining table entry if code is incomplete (guaranteed to have
     at most one remaining entry, since if the code is incomplete, the
     maximum code length that was allowed to get this far is one bit) */
    if (huff !== 0) {
      //table.op[next + huff] = 64;            /* invalid code marker */
      //table.bits[next + huff] = len - drop;
      //table.val[next + huff] = 0;
      table[next + huff] = len - drop << 24 | 64 << 16 | 0;
    }

    /* set return parameters */
    //opts.table_index += used;
    opts.bits = root;
    return 0;
  };
  var inftrees = inflate_table;

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  var CODES = 0;
  var LENS = 1;
  var DISTS = 2;

  /* Public constants ==========================================================*/
  /* ===========================================================================*/

  var Z_FINISH$1 = constants$2.Z_FINISH,
    Z_BLOCK = constants$2.Z_BLOCK,
    Z_TREES = constants$2.Z_TREES,
    Z_OK$1 = constants$2.Z_OK,
    Z_STREAM_END$1 = constants$2.Z_STREAM_END,
    Z_NEED_DICT$1 = constants$2.Z_NEED_DICT,
    Z_STREAM_ERROR$1 = constants$2.Z_STREAM_ERROR,
    Z_DATA_ERROR$1 = constants$2.Z_DATA_ERROR,
    Z_MEM_ERROR$1 = constants$2.Z_MEM_ERROR,
    Z_BUF_ERROR = constants$2.Z_BUF_ERROR,
    Z_DEFLATED = constants$2.Z_DEFLATED;

  /* STATES ====================================================================*/
  /* ===========================================================================*/

  var HEAD = 16180; /* i: waiting for magic header */
  var FLAGS = 16181; /* i: waiting for method and flags (gzip) */
  var TIME = 16182; /* i: waiting for modification time (gzip) */
  var OS = 16183; /* i: waiting for extra flags and operating system (gzip) */
  var EXLEN = 16184; /* i: waiting for extra length (gzip) */
  var EXTRA = 16185; /* i: waiting for extra bytes (gzip) */
  var NAME = 16186; /* i: waiting for end of file name (gzip) */
  var COMMENT = 16187; /* i: waiting for end of comment (gzip) */
  var HCRC = 16188; /* i: waiting for header crc (gzip) */
  var DICTID = 16189; /* i: waiting for dictionary check value */
  var DICT = 16190; /* waiting for inflateSetDictionary() call */
  var TYPE = 16191; /* i: waiting for type bits, including last-flag bit */
  var TYPEDO = 16192; /* i: same, but skip check to exit inflate on new block */
  var STORED = 16193; /* i: waiting for stored size (length and complement) */
  var COPY_ = 16194; /* i/o: same as COPY below, but only first time in */
  var COPY = 16195; /* i/o: waiting for input or output to copy stored block */
  var TABLE = 16196; /* i: waiting for dynamic block table lengths */
  var LENLENS = 16197; /* i: waiting for code length code lengths */
  var CODELENS = 16198; /* i: waiting for length/lit and distance code lengths */
  var LEN_ = 16199; /* i: same as LEN below, but only first time in */
  var LEN = 16200; /* i: waiting for length/lit/eob code */
  var LENEXT = 16201; /* i: waiting for length extra bits */
  var DIST = 16202; /* i: waiting for distance code */
  var DISTEXT = 16203; /* i: waiting for distance extra bits */
  var MATCH = 16204; /* o: waiting for output space to copy string */
  var LIT = 16205; /* o: waiting for output space to write literal */
  var CHECK = 16206; /* i: waiting for 32-bit check value */
  var LENGTH = 16207; /* i: waiting for 32-bit length (gzip) */
  var DONE = 16208; /* finished check, done -- remain here until reset */
  var BAD = 16209; /* got a data error -- remain here until reset */
  var MEM = 16210; /* got an inflate() memory error -- remain here until reset */
  var SYNC = 16211; /* looking for synchronization bytes to restart inflate() */

  /* ===========================================================================*/

  var ENOUGH_LENS = 852;
  var ENOUGH_DISTS = 592;
  //const ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

  var MAX_WBITS = 15;
  /* 32K LZ77 window */
  var DEF_WBITS = MAX_WBITS;
  var zswap32 = function zswap32(q) {
    return (q >>> 24 & 0xff) + (q >>> 8 & 0xff00) + ((q & 0xff00) << 8) + ((q & 0xff) << 24);
  };
  function InflateState() {
    this.strm = null; /* pointer back to this zlib stream */
    this.mode = 0; /* current inflate mode */
    this.last = false; /* true if processing last block */
    this.wrap = 0; /* bit 0 true for zlib, bit 1 true for gzip,
                      bit 2 true to validate check value */
    this.havedict = false; /* true if dictionary provided */
    this.flags = 0; /* gzip header method and flags (0 if zlib), or
                       -1 if raw or no header yet */
    this.dmax = 0; /* zlib header max distance (INFLATE_STRICT) */
    this.check = 0; /* protected copy of check value */
    this.total = 0; /* protected copy of output count */
    // TODO: may be {}
    this.head = null; /* where to save gzip header information */

    /* sliding window */
    this.wbits = 0; /* log base 2 of requested window size */
    this.wsize = 0; /* window size or zero if not using window */
    this.whave = 0; /* valid bytes in the window */
    this.wnext = 0; /* window write index */
    this.window = null; /* allocated sliding window, if needed */

    /* bit accumulator */
    this.hold = 0; /* input bit accumulator */
    this.bits = 0; /* number of bits in "in" */

    /* for string and stored block copying */
    this.length = 0; /* literal or length of data to copy */
    this.offset = 0; /* distance back to copy string from */

    /* for table and code decoding */
    this.extra = 0; /* extra bits needed */

    /* fixed and dynamic code tables */
    this.lencode = null; /* starting table for length/literal codes */
    this.distcode = null; /* starting table for distance codes */
    this.lenbits = 0; /* index bits for lencode */
    this.distbits = 0; /* index bits for distcode */

    /* dynamic table building */
    this.ncode = 0; /* number of code length code lengths */
    this.nlen = 0; /* number of length code lengths */
    this.ndist = 0; /* number of distance code lengths */
    this.have = 0; /* number of code lengths in lens[] */
    this.next = null; /* next available space in codes[] */

    this.lens = new Uint16Array(320); /* temporary storage for code lengths */
    this.work = new Uint16Array(288); /* work area for code table building */

    /*
     because we don't have pointers in js, we use lencode and distcode directly
     as buffers so we don't need codes
    */
    //this.codes = new Int32Array(ENOUGH);       /* space for code tables */
    this.lendyn = null; /* dynamic table for length/literal codes (JS specific) */
    this.distdyn = null; /* dynamic table for distance codes (JS specific) */
    this.sane = 0; /* if false, allow invalid distance too far */
    this.back = 0; /* bits back of last unprocessed length/lit */
    this.was = 0; /* initial length of match */
  }

  var inflateStateCheck = function inflateStateCheck(strm) {
    if (!strm) {
      return 1;
    }
    var state = strm.state;
    if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) {
      return 1;
    }
    return 0;
  };
  var inflateResetKeep = function inflateResetKeep(strm) {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    var state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = ''; /*Z_NULL*/
    if (state.wrap) {
      /* to support ill-conceived Java test suite */
      strm.adler = state.wrap & 1;
    }
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.flags = -1;
    state.dmax = 32768;
    state.head = null /*Z_NULL*/;
    state.hold = 0;
    state.bits = 0;
    //state.lencode = state.distcode = state.next = state.codes;
    state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
    state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
    state.sane = 1;
    state.back = -1;
    //Tracev((stderr, "inflate: reset\n"));
    return Z_OK$1;
  };
  var inflateReset = function inflateReset(strm) {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    var state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);
  };
  var inflateReset2 = function inflateReset2(strm, windowBits) {
    var wrap;

    /* get the state */
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    var state = strm.state;

    /* extract wrap request from windowBits parameter */
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else {
      wrap = (windowBits >> 4) + 5;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }

    /* set number of window bits, free window if different */
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR$1;
    }
    if (state.window !== null && state.wbits !== windowBits) {
      state.window = null;
    }

    /* update state and reset the rest of it */
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  };
  var inflateInit2 = function inflateInit2(strm, windowBits) {
    if (!strm) {
      return Z_STREAM_ERROR$1;
    }
    //strm.msg = Z_NULL;                 /* in case we return an error */

    var state = new InflateState();

    //if (state === Z_NULL) return Z_MEM_ERROR;
    //Tracev((stderr, "inflate: allocated\n"));
    strm.state = state;
    state.strm = strm;
    state.window = null /*Z_NULL*/;
    state.mode = HEAD; /* to pass state test in inflateReset2() */
    var ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK$1) {
      strm.state = null /*Z_NULL*/;
    }

    return ret;
  };
  var inflateInit = function inflateInit(strm) {
    return inflateInit2(strm, DEF_WBITS);
  };

  /*
   Return state with length and distance decoding tables and index sizes set to
   fixed code decoding.  Normally this returns fixed tables from inffixed.h.
   If BUILDFIXED is defined, then instead this routine builds the tables the
   first time it's called, and returns those tables the first time and
   thereafter.  This reduces the size of the code by about 2K bytes, in
   exchange for a little execution time.  However, BUILDFIXED should not be
   used for threaded applications, since the rewriting of the tables and virgin
   may not be thread-safe.
   */
  var virgin = true;
  var lenfix, distfix; // We have no pointers in JS, so keep tables separate

  var fixedtables = function fixedtables(state) {
    /* build fixed huffman tables if first call (may not be thread safe) */
    if (virgin) {
      lenfix = new Int32Array(512);
      distfix = new Int32Array(32);

      /* literal/length table */
      var sym = 0;
      while (sym < 144) {
        state.lens[sym++] = 8;
      }
      while (sym < 256) {
        state.lens[sym++] = 9;
      }
      while (sym < 280) {
        state.lens[sym++] = 7;
      }
      while (sym < 288) {
        state.lens[sym++] = 8;
      }
      inftrees(LENS, state.lens, 0, 288, lenfix, 0, state.work, {
        bits: 9
      });

      /* distance table */
      sym = 0;
      while (sym < 32) {
        state.lens[sym++] = 5;
      }
      inftrees(DISTS, state.lens, 0, 32, distfix, 0, state.work, {
        bits: 5
      });

      /* do this just once */
      virgin = false;
    }
    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  };

  /*
   Update the window with the last wsize (normally 32K) bytes written before
   returning.  If window does not exist yet, create it.  This is only called
   when a window is already in use, or when output has been written during this
   inflate call, but the end of the deflate stream has not been reached yet.
   It is also called to create a window for dictionary data when a dictionary
   is loaded.

   Providing output buffers larger than 32K to inflate() should provide a speed
   advantage, since only the last 32K of output is copied to the sliding window
   upon return from inflate(), and since all distances after the first 32K of
   output will fall in the output data, making match copies simpler and faster.
   The advantage may be dependent on the size of the processor's data caches.
   */
  var updatewindow = function updatewindow(strm, src, end, copy) {
    var dist;
    var state = strm.state;

    /* if it hasn't been done already, allocate space for the window */
    if (state.window === null) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;
      state.window = new Uint8Array(state.wsize);
    }

    /* copy state->wsize or less output bytes into the circular window */
    if (copy >= state.wsize) {
      state.window.set(src.subarray(end - state.wsize, end), 0);
      state.wnext = 0;
      state.whave = state.wsize;
    } else {
      dist = state.wsize - state.wnext;
      if (dist > copy) {
        dist = copy;
      }
      //zmemcpy(state->window + state->wnext, end - copy, dist);
      state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
      copy -= dist;
      if (copy) {
        //zmemcpy(state->window, end - copy, copy);
        state.window.set(src.subarray(end - copy, end), 0);
        state.wnext = copy;
        state.whave = state.wsize;
      } else {
        state.wnext += dist;
        if (state.wnext === state.wsize) {
          state.wnext = 0;
        }
        if (state.whave < state.wsize) {
          state.whave += dist;
        }
      }
    }
    return 0;
  };
  var inflate$2 = function inflate(strm, flush) {
    var state;
    var input, output; // input/output buffers
    var next; /* next input INDEX */
    var put; /* next output INDEX */
    var have, left; /* available input and output */
    var hold; /* bit buffer */
    var bits; /* bits in bit buffer */
    var _in, _out; /* save starting available input and output */
    var copy; /* number of stored or match bytes to copy */
    var from; /* where to copy match bytes from */
    var from_source;
    var here = 0; /* current decoding table entry */
    var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
    //let last;                   /* parent table entry */
    var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
    var len; /* length to copy for repeats, bits to drop */
    var ret; /* return code */
    var hbuf = new Uint8Array(4); /* buffer for gzip header crc calculation */
    var opts;
    var n; // temporary variable for NEED_BITS

    var order = /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
      return Z_STREAM_ERROR$1;
    }
    state = strm.state;
    if (state.mode === TYPE) {
      state.mode = TYPEDO;
    } /* skip check */

    //--- LOAD() ---
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    //---

    _in = have;
    _out = left;
    ret = Z_OK$1;
    inf_leave:
    // goto emulation
    for (;;) {
      switch (state.mode) {
        case HEAD:
          if (state.wrap === 0) {
            state.mode = TYPEDO;
            break;
          }
          //=== NEEDBITS(16);
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (state.wrap & 2 && hold === 0x8b1f) {
            /* gzip header */
            if (state.wbits === 0) {
              state.wbits = 15;
            }
            state.check = 0 /*crc32(0L, Z_NULL, 0)*/;
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = hold >>> 8 & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//

            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = FLAGS;
            break;
          }
          if (state.head) {
            state.head.done = false;
          }
          if (!(state.wrap & 1) || /* check if zlib header allowed */
          (((hold & 0xff /*BITS(8)*/) << 8) + (hold >> 8)) % 31) {
            strm.msg = 'incorrect header check';
            state.mode = BAD;
            break;
          }
          if ((hold & 0x0f /*BITS(4)*/) !== Z_DEFLATED) {
            strm.msg = 'unknown compression method';
            state.mode = BAD;
            break;
          }
          //--- DROPBITS(4) ---//
          hold >>>= 4;
          bits -= 4;
          //---//
          len = (hold & 0x0f /*BITS(4)*/) + 8;
          if (state.wbits === 0) {
            state.wbits = len;
          }
          if (len > 15 || len > state.wbits) {
            strm.msg = 'invalid window size';
            state.mode = BAD;
            break;
          }

          // !!! pako patch. Force use `options.windowBits` if passed.
          // Required to always use max window size by default.
          state.dmax = 1 << state.wbits;
          //state.dmax = 1 << len;

          state.flags = 0; /* indicate zlib header */
          //Tracev((stderr, "inflate:   zlib header ok\n"));
          strm.adler = state.check = 1 /*adler32(0L, Z_NULL, 0)*/;
          state.mode = hold & 0x200 ? DICTID : TYPE;
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          break;
        case FLAGS:
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.flags = hold;
          if ((state.flags & 0xff) !== Z_DEFLATED) {
            strm.msg = 'unknown compression method';
            state.mode = BAD;
            break;
          }
          if (state.flags & 0xe000) {
            strm.msg = 'unknown header flags set';
            state.mode = BAD;
            break;
          }
          if (state.head) {
            state.head.text = hold >> 8 & 1;
          }
          if (state.flags & 0x0200 && state.wrap & 4) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = hold >>> 8 & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = TIME;
        /* falls through */
        case TIME:
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (state.head) {
            state.head.time = hold;
          }
          if (state.flags & 0x0200 && state.wrap & 4) {
            //=== CRC4(state.check, hold)
            hbuf[0] = hold & 0xff;
            hbuf[1] = hold >>> 8 & 0xff;
            hbuf[2] = hold >>> 16 & 0xff;
            hbuf[3] = hold >>> 24 & 0xff;
            state.check = crc32_1(state.check, hbuf, 4, 0);
            //===
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = OS;
        /* falls through */
        case OS:
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (state.head) {
            state.head.xflags = hold & 0xff;
            state.head.os = hold >> 8;
          }
          if (state.flags & 0x0200 && state.wrap & 4) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = hold >>> 8 & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = EXLEN;
        /* falls through */
        case EXLEN:
          if (state.flags & 0x0400) {
            //=== NEEDBITS(16); */
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.length = hold;
            if (state.head) {
              state.head.extra_len = hold;
            }
            if (state.flags & 0x0200 && state.wrap & 4) {
              //=== CRC2(state.check, hold);
              hbuf[0] = hold & 0xff;
              hbuf[1] = hold >>> 8 & 0xff;
              state.check = crc32_1(state.check, hbuf, 2, 0);
              //===//
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
          } else if (state.head) {
            state.head.extra = null /*Z_NULL*/;
          }

          state.mode = EXTRA;
        /* falls through */
        case EXTRA:
          if (state.flags & 0x0400) {
            copy = state.length;
            if (copy > have) {
              copy = have;
            }
            if (copy) {
              if (state.head) {
                len = state.head.extra_len - state.length;
                if (!state.head.extra) {
                  // Use untyped array for more convenient processing later
                  state.head.extra = new Uint8Array(state.head.extra_len);
                }
                state.head.extra.set(input.subarray(next,
                // extra field is limited to 65536 bytes
                // - no need for additional size check
                next + copy), /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len);
                //zmemcpy(state.head.extra + len, next,
                //        len + copy > state.head.extra_max ?
                //        state.head.extra_max - len : copy);
              }

              if (state.flags & 0x0200 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              state.length -= copy;
            }
            if (state.length) {
              break inf_leave;
            }
          }
          state.length = 0;
          state.mode = NAME;
        /* falls through */
        case NAME:
          if (state.flags & 0x0800) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              // TODO: 2 or 1 bytes?
              len = input[next + copy++];
              /* use constant limit because in js we should not preallocate memory */
              if (state.head && len && state.length < 65536 /*state.head.name_max*/) {
                state.head.name += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 0x0200 && state.wrap & 4) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.name = null;
          }
          state.length = 0;
          state.mode = COMMENT;
        /* falls through */
        case COMMENT:
          if (state.flags & 0x1000) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              len = input[next + copy++];
              /* use constant limit because in js we should not preallocate memory */
              if (state.head && len && state.length < 65536 /*state.head.comm_max*/) {
                state.head.comment += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 0x0200 && state.wrap & 4) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.comment = null;
          }
          state.mode = HCRC;
        /* falls through */
        case HCRC:
          if (state.flags & 0x0200) {
            //=== NEEDBITS(16); */
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            if (state.wrap & 4 && hold !== (state.check & 0xffff)) {
              strm.msg = 'header crc mismatch';
              state.mode = BAD;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
          }

          if (state.head) {
            state.head.hcrc = state.flags >> 9 & 1;
            state.head.done = true;
          }
          strm.adler = state.check = 0;
          state.mode = TYPE;
          break;
        case DICTID:
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          strm.adler = state.check = zswap32(hold);
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = DICT;
        /* falls through */
        case DICT:
          if (state.havedict === 0) {
            //--- RESTORE() ---
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            //---
            return Z_NEED_DICT$1;
          }
          strm.adler = state.check = 1 /*adler32(0L, Z_NULL, 0)*/;
          state.mode = TYPE;
        /* falls through */
        case TYPE:
          if (flush === Z_BLOCK || flush === Z_TREES) {
            break inf_leave;
          }
        /* falls through */
        case TYPEDO:
          if (state.last) {
            //--- BYTEBITS() ---//
            hold >>>= bits & 7;
            bits -= bits & 7;
            //---//
            state.mode = CHECK;
            break;
          }
          //=== NEEDBITS(3); */
          while (bits < 3) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.last = hold & 0x01 /*BITS(1)*/;
          //--- DROPBITS(1) ---//
          hold >>>= 1;
          bits -= 1;
          //---//

          switch (hold & 0x03 /*BITS(2)*/) {
            case 0:
              /* stored block */
              //Tracev((stderr, "inflate:     stored block%s\n",
              //        state.last ? " (last)" : ""));
              state.mode = STORED;
              break;
            case 1:
              /* fixed block */
              fixedtables(state);
              //Tracev((stderr, "inflate:     fixed codes block%s\n",
              //        state.last ? " (last)" : ""));
              state.mode = LEN_; /* decode codes */
              if (flush === Z_TREES) {
                //--- DROPBITS(2) ---//
                hold >>>= 2;
                bits -= 2;
                //---//
                break inf_leave;
              }
              break;
            case 2:
              /* dynamic block */
              //Tracev((stderr, "inflate:     dynamic codes block%s\n",
              //        state.last ? " (last)" : ""));
              state.mode = TABLE;
              break;
            case 3:
              strm.msg = 'invalid block type';
              state.mode = BAD;
          }
          //--- DROPBITS(2) ---//
          hold >>>= 2;
          bits -= 2;
          //---//
          break;
        case STORED:
          //--- BYTEBITS() ---// /* go to byte boundary */
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((hold & 0xffff) !== (hold >>> 16 ^ 0xffff)) {
            strm.msg = 'invalid stored block lengths';
            state.mode = BAD;
            break;
          }
          state.length = hold & 0xffff;
          //Tracev((stderr, "inflate:       stored length %u\n",
          //        state.length));
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = COPY_;
          if (flush === Z_TREES) {
            break inf_leave;
          }
        /* falls through */
        case COPY_:
          state.mode = COPY;
        /* falls through */
        case COPY:
          copy = state.length;
          if (copy) {
            if (copy > have) {
              copy = have;
            }
            if (copy > left) {
              copy = left;
            }
            if (copy === 0) {
              break inf_leave;
            }
            //--- zmemcpy(put, next, copy); ---
            output.set(input.subarray(next, next + copy), put);
            //---//
            have -= copy;
            next += copy;
            left -= copy;
            put += copy;
            state.length -= copy;
            break;
          }
          //Tracev((stderr, "inflate:       stored end\n"));
          state.mode = TYPE;
          break;
        case TABLE:
          //=== NEEDBITS(14); */
          while (bits < 14) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.nlen = (hold & 0x1f /*BITS(5)*/) + 257;
          //--- DROPBITS(5) ---//
          hold >>>= 5;
          bits -= 5;
          //---//
          state.ndist = (hold & 0x1f /*BITS(5)*/) + 1;
          //--- DROPBITS(5) ---//
          hold >>>= 5;
          bits -= 5;
          //---//
          state.ncode = (hold & 0x0f /*BITS(4)*/) + 4;
          //--- DROPBITS(4) ---//
          hold >>>= 4;
          bits -= 4;
          //---//
          //#ifndef PKZIP_BUG_WORKAROUND
          if (state.nlen > 286 || state.ndist > 30) {
            strm.msg = 'too many length or distance symbols';
            state.mode = BAD;
            break;
          }
          //#endif
          //Tracev((stderr, "inflate:       table sizes ok\n"));
          state.have = 0;
          state.mode = LENLENS;
        /* falls through */
        case LENLENS:
          while (state.have < state.ncode) {
            //=== NEEDBITS(3);
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.lens[order[state.have++]] = hold & 0x07; //BITS(3);
            //--- DROPBITS(3) ---//
            hold >>>= 3;
            bits -= 3;
            //---//
          }

          while (state.have < 19) {
            state.lens[order[state.have++]] = 0;
          }
          // We have separate tables & no pointers. 2 commented lines below not needed.
          //state.next = state.codes;
          //state.lencode = state.next;
          // Switch to use dynamic table
          state.lencode = state.lendyn;
          state.lenbits = 7;
          opts = {
            bits: state.lenbits
          };
          ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
          if (ret) {
            strm.msg = 'invalid code lengths set';
            state.mode = BAD;
            break;
          }
          //Tracev((stderr, "inflate:       code lengths ok\n"));
          state.have = 0;
          state.mode = CODELENS;
        /* falls through */
        case CODELENS:
          while (state.have < state.nlen + state.ndist) {
            for (;;) {
              here = state.lencode[hold & (1 << state.lenbits) - 1]; /*BITS(state.lenbits)*/
              here_bits = here >>> 24;
              here_op = here >>> 16 & 0xff;
              here_val = here & 0xffff;
              if (here_bits <= bits) {
                break;
              }
              //--- PULLBYTE() ---//
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }

            if (here_val < 16) {
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              state.lens[state.have++] = here_val;
            } else {
              if (here_val === 16) {
                //=== NEEDBITS(here.bits + 2);
                n = here_bits + 2;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                if (state.have === 0) {
                  strm.msg = 'invalid bit length repeat';
                  state.mode = BAD;
                  break;
                }
                len = state.lens[state.have - 1];
                copy = 3 + (hold & 0x03); //BITS(2);
                //--- DROPBITS(2) ---//
                hold >>>= 2;
                bits -= 2;
                //---//
              } else if (here_val === 17) {
                //=== NEEDBITS(here.bits + 3);
                n = here_bits + 3;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                len = 0;
                copy = 3 + (hold & 0x07); //BITS(3);
                //--- DROPBITS(3) ---//
                hold >>>= 3;
                bits -= 3;
                //---//
              } else {
                //=== NEEDBITS(here.bits + 7);
                n = here_bits + 7;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                len = 0;
                copy = 11 + (hold & 0x7f); //BITS(7);
                //--- DROPBITS(7) ---//
                hold >>>= 7;
                bits -= 7;
                //---//
              }

              if (state.have + copy > state.nlen + state.ndist) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              while (copy--) {
                state.lens[state.have++] = len;
              }
            }
          }

          /* handle error breaks in while */
          if (state.mode === BAD) {
            break;
          }

          /* check for end-of-block code (better have one) */
          if (state.lens[256] === 0) {
            strm.msg = 'invalid code -- missing end-of-block';
            state.mode = BAD;
            break;
          }

          /* build code tables -- note: do not change the lenbits or distbits
             values here (9 and 6) without reading the comments in inftrees.h
             concerning the ENOUGH constants, which depend on those values */
          state.lenbits = 9;
          opts = {
            bits: state.lenbits
          };
          ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
          // We have separate tables & no pointers. 2 commented lines below not needed.
          // state.next_index = opts.table_index;
          state.lenbits = opts.bits;
          // state.lencode = state.next;

          if (ret) {
            strm.msg = 'invalid literal/lengths set';
            state.mode = BAD;
            break;
          }
          state.distbits = 6;
          //state.distcode.copy(state.codes);
          // Switch to use dynamic table
          state.distcode = state.distdyn;
          opts = {
            bits: state.distbits
          };
          ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
          // We have separate tables & no pointers. 2 commented lines below not needed.
          // state.next_index = opts.table_index;
          state.distbits = opts.bits;
          // state.distcode = state.next;

          if (ret) {
            strm.msg = 'invalid distances set';
            state.mode = BAD;
            break;
          }
          //Tracev((stderr, 'inflate:       codes ok\n'));
          state.mode = LEN_;
          if (flush === Z_TREES) {
            break inf_leave;
          }
        /* falls through */
        case LEN_:
          state.mode = LEN;
        /* falls through */
        case LEN:
          if (have >= 6 && left >= 258) {
            //--- RESTORE() ---
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            //---
            inffast(strm, _out);
            //--- LOAD() ---
            put = strm.next_out;
            output = strm.output;
            left = strm.avail_out;
            next = strm.next_in;
            input = strm.input;
            have = strm.avail_in;
            hold = state.hold;
            bits = state.bits;
            //---

            if (state.mode === TYPE) {
              state.back = -1;
            }
            break;
          }
          state.back = 0;
          for (;;) {
            here = state.lencode[hold & (1 << state.lenbits) - 1]; /*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = here >>> 16 & 0xff;
            here_val = here & 0xffff;
            if (here_bits <= bits) {
              break;
            }
            //--- PULLBYTE() ---//
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }

          if (here_op && (here_op & 0xf0) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (;;) {
              here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1 /*BITS(last.bits + last.op)*/) >> last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 0xff;
              here_val = here & 0xffff;
              if (last_bits + here_bits <= bits) {
                break;
              }
              //--- PULLBYTE() ---//
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }
            //--- DROPBITS(last.bits) ---//
            hold >>>= last_bits;
            bits -= last_bits;
            //---//
            state.back += last_bits;
          }
          //--- DROPBITS(here.bits) ---//
          hold >>>= here_bits;
          bits -= here_bits;
          //---//
          state.back += here_bits;
          state.length = here_val;
          if (here_op === 0) {
            //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
            //        "inflate:         literal '%c'\n" :
            //        "inflate:         literal 0x%02x\n", here.val));
            state.mode = LIT;
            break;
          }
          if (here_op & 32) {
            //Tracevv((stderr, "inflate:         end of block\n"));
            state.back = -1;
            state.mode = TYPE;
            break;
          }
          if (here_op & 64) {
            strm.msg = 'invalid literal/length code';
            state.mode = BAD;
            break;
          }
          state.extra = here_op & 15;
          state.mode = LENEXT;
        /* falls through */
        case LENEXT:
          if (state.extra) {
            //=== NEEDBITS(state.extra);
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.length += hold & (1 << state.extra) - 1 /*BITS(state.extra)*/;
            //--- DROPBITS(state.extra) ---//
            hold >>>= state.extra;
            bits -= state.extra;
            //---//
            state.back += state.extra;
          }
          //Tracevv((stderr, "inflate:         length %u\n", state.length));
          state.was = state.length;
          state.mode = DIST;
        /* falls through */
        case DIST:
          for (;;) {
            here = state.distcode[hold & (1 << state.distbits) - 1]; /*BITS(state.distbits)*/
            here_bits = here >>> 24;
            here_op = here >>> 16 & 0xff;
            here_val = here & 0xffff;
            if (here_bits <= bits) {
              break;
            }
            //--- PULLBYTE() ---//
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }

          if ((here_op & 0xf0) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (;;) {
              here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1 /*BITS(last.bits + last.op)*/) >> last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 0xff;
              here_val = here & 0xffff;
              if (last_bits + here_bits <= bits) {
                break;
              }
              //--- PULLBYTE() ---//
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }
            //--- DROPBITS(last.bits) ---//
            hold >>>= last_bits;
            bits -= last_bits;
            //---//
            state.back += last_bits;
          }
          //--- DROPBITS(here.bits) ---//
          hold >>>= here_bits;
          bits -= here_bits;
          //---//
          state.back += here_bits;
          if (here_op & 64) {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break;
          }
          state.offset = here_val;
          state.extra = here_op & 15;
          state.mode = DISTEXT;
        /* falls through */
        case DISTEXT:
          if (state.extra) {
            //=== NEEDBITS(state.extra);
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.offset += hold & (1 << state.extra) - 1 /*BITS(state.extra)*/;
            //--- DROPBITS(state.extra) ---//
            hold >>>= state.extra;
            bits -= state.extra;
            //---//
            state.back += state.extra;
          }
          //#ifdef INFLATE_STRICT
          if (state.offset > state.dmax) {
            strm.msg = 'invalid distance too far back';
            state.mode = BAD;
            break;
          }
          //#endif
          //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
          state.mode = MATCH;
        /* falls through */
        case MATCH:
          if (left === 0) {
            break inf_leave;
          }
          copy = _out - left;
          if (state.offset > copy) {
            /* copy from window */
            copy = state.offset - copy;
            if (copy > state.whave) {
              if (state.sane) {
                strm.msg = 'invalid distance too far back';
                state.mode = BAD;
                break;
              }
              // (!) This block is disabled in zlib defaults,
              // don't enable it for binary compatibility
              //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
              //          Trace((stderr, "inflate.c too far\n"));
              //          copy -= state.whave;
              //          if (copy > state.length) { copy = state.length; }
              //          if (copy > left) { copy = left; }
              //          left -= copy;
              //          state.length -= copy;
              //          do {
              //            output[put++] = 0;
              //          } while (--copy);
              //          if (state.length === 0) { state.mode = LEN; }
              //          break;
              //#endif
            }

            if (copy > state.wnext) {
              copy -= state.wnext;
              from = state.wsize - copy;
            } else {
              from = state.wnext - copy;
            }
            if (copy > state.length) {
              copy = state.length;
            }
            from_source = state.window;
          } else {
            /* copy from output */
            from_source = output;
            from = put - state.offset;
            copy = state.length;
          }
          if (copy > left) {
            copy = left;
          }
          left -= copy;
          state.length -= copy;
          do {
            output[put++] = from_source[from++];
          } while (--copy);
          if (state.length === 0) {
            state.mode = LEN;
          }
          break;
        case LIT:
          if (left === 0) {
            break inf_leave;
          }
          output[put++] = state.length;
          left--;
          state.mode = LEN;
          break;
        case CHECK:
          if (state.wrap) {
            //=== NEEDBITS(32);
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              // Use '|' instead of '+' to make sure that result is signed
              hold |= input[next++] << bits;
              bits += 8;
            }
            //===//
            _out -= left;
            strm.total_out += _out;
            state.total += _out;
            if (state.wrap & 4 && _out) {
              strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
              state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out);
            }
            _out = left;
            // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
            if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
              strm.msg = 'incorrect data check';
              state.mode = BAD;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            //Tracev((stderr, "inflate:   check matches trailer\n"));
          }

          state.mode = LENGTH;
        /* falls through */
        case LENGTH:
          if (state.wrap && state.flags) {
            //=== NEEDBITS(32);
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            if (state.wrap & 4 && hold !== (state.total & 0xffffffff)) {
              strm.msg = 'incorrect length check';
              state.mode = BAD;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            //Tracev((stderr, "inflate:   length matches trailer\n"));
          }

          state.mode = DONE;
        /* falls through */
        case DONE:
          ret = Z_STREAM_END$1;
          break inf_leave;
        case BAD:
          ret = Z_DATA_ERROR$1;
          break inf_leave;
        case MEM:
          return Z_MEM_ERROR$1;
        case SYNC:
        /* falls through */
        default:
          return Z_STREAM_ERROR$1;
      }
    }

    // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

    /*
       Return from inflate(), updating the total counts and the check value.
       If there was no progress during the inflate() call, return a buffer
       error.  Call updatewindow() to create and/or update the window state.
       Note: a memory error from inflate() is non-recoverable.
     */

    //--- RESTORE() ---
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    //---

    if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap & 4 && _out) {
      strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out);
    }
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
      ret = Z_BUF_ERROR;
    }
    return ret;
  };
  var inflateEnd = function inflateEnd(strm) {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    var state = strm.state;
    if (state.window) {
      state.window = null;
    }
    strm.state = null;
    return Z_OK$1;
  };
  var inflateGetHeader = function inflateGetHeader(strm, head) {
    /* check state */
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    var state = strm.state;
    if ((state.wrap & 2) === 0) {
      return Z_STREAM_ERROR$1;
    }

    /* save header structure */
    state.head = head;
    head.done = false;
    return Z_OK$1;
  };
  var inflateSetDictionary = function inflateSetDictionary(strm, dictionary) {
    var dictLength = dictionary.length;
    var state;
    var dictid;
    var ret;

    /* check state */
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    state = strm.state;
    if (state.wrap !== 0 && state.mode !== DICT) {
      return Z_STREAM_ERROR$1;
    }

    /* check for correct dictionary identifier */
    if (state.mode === DICT) {
      dictid = 1; /* adler32(0, null, 0)*/
      /* dictid = adler32(dictid, dictionary, dictLength); */
      dictid = adler32_1(dictid, dictionary, dictLength, 0);
      if (dictid !== state.check) {
        return Z_DATA_ERROR$1;
      }
    }
    /* copy dictionary to window using updatewindow(), which will amend the
     existing dictionary if appropriate */
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state.mode = MEM;
      return Z_MEM_ERROR$1;
    }
    state.havedict = 1;
    // Tracev((stderr, "inflate:   dictionary set\n"));
    return Z_OK$1;
  };
  var inflateReset_1 = inflateReset;
  var inflateReset2_1 = inflateReset2;
  var inflateResetKeep_1 = inflateResetKeep;
  var inflateInit_1 = inflateInit;
  var inflateInit2_1 = inflateInit2;
  var inflate_2$1 = inflate$2;
  var inflateEnd_1 = inflateEnd;
  var inflateGetHeader_1 = inflateGetHeader;
  var inflateSetDictionary_1 = inflateSetDictionary;
  var inflateInfo = 'pako inflate (from Nodeca project)';

  /* Not implemented
  module.exports.inflateCodesUsed = inflateCodesUsed;
  module.exports.inflateCopy = inflateCopy;
  module.exports.inflateGetDictionary = inflateGetDictionary;
  module.exports.inflateMark = inflateMark;
  module.exports.inflatePrime = inflatePrime;
  module.exports.inflateSync = inflateSync;
  module.exports.inflateSyncPoint = inflateSyncPoint;
  module.exports.inflateUndermine = inflateUndermine;
  module.exports.inflateValidate = inflateValidate;
  */

  var inflate_1$2 = {
    inflateReset: inflateReset_1,
    inflateReset2: inflateReset2_1,
    inflateResetKeep: inflateResetKeep_1,
    inflateInit: inflateInit_1,
    inflateInit2: inflateInit2_1,
    inflate: inflate_2$1,
    inflateEnd: inflateEnd_1,
    inflateGetHeader: inflateGetHeader_1,
    inflateSetDictionary: inflateSetDictionary_1,
    inflateInfo: inflateInfo
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.
  function GZheader() {
    /* true if compressed data believed to be text */
    this.text = 0;
    /* modification time */
    this.time = 0;
    /* extra flags (not used when writing a gzip file) */
    this.xflags = 0;
    /* operating system */
    this.os = 0;
    /* pointer to extra field or Z_NULL if none */
    this.extra = null;
    /* extra field length (valid if extra != Z_NULL) */
    this.extra_len = 0; // Actually, we don't need it in JS,
    // but leave for few code modifications

    //
    // Setup limits is not necessary because in js we should not preallocate memory
    // for inflate use constant limit in 65536 bytes
    //

    /* space at extra (only when reading header) */
    // this.extra_max  = 0;
    /* pointer to zero-terminated file name or Z_NULL */
    this.name = '';
    /* space at name (only when reading header) */
    // this.name_max   = 0;
    /* pointer to zero-terminated comment or Z_NULL */
    this.comment = '';
    /* space at comment (only when reading header) */
    // this.comm_max   = 0;
    /* true if there was or will be a header crc */
    this.hcrc = 0;
    /* true when done reading gzip header (not used when writing a gzip file) */
    this.done = false;
  }
  var gzheader = GZheader;

  var toString = Object.prototype.toString;

  /* Public constants ==========================================================*/
  /* ===========================================================================*/

  var Z_NO_FLUSH = constants$2.Z_NO_FLUSH,
    Z_FINISH = constants$2.Z_FINISH,
    Z_OK = constants$2.Z_OK,
    Z_STREAM_END = constants$2.Z_STREAM_END,
    Z_NEED_DICT = constants$2.Z_NEED_DICT,
    Z_STREAM_ERROR = constants$2.Z_STREAM_ERROR,
    Z_DATA_ERROR = constants$2.Z_DATA_ERROR,
    Z_MEM_ERROR = constants$2.Z_MEM_ERROR;

  /* ===========================================================================*/

  /**
   * class Inflate
   *
   * Generic JS-style wrapper for zlib calls. If you don't need
   * streaming behaviour - use more simple functions: [[inflate]]
   * and [[inflateRaw]].
   **/

  /* internal
   * inflate.chunks -> Array
   *
   * Chunks of output data, if [[Inflate#onData]] not overridden.
   **/

  /**
   * Inflate.result -> Uint8Array|String
   *
   * Uncompressed result, generated by default [[Inflate#onData]]
   * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
   * (call [[Inflate#push]] with `Z_FINISH` / `true` param).
   **/

  /**
   * Inflate.err -> Number
   *
   * Error code after inflate finished. 0 (Z_OK) on success.
   * Should be checked if broken data possible.
   **/

  /**
   * Inflate.msg -> String
   *
   * Error message, if [[Inflate.err]] != 0
   **/

  /**
   * new Inflate(options)
   * - options (Object): zlib inflate options.
   *
   * Creates new inflator instance with specified params. Throws exception
   * on bad params. Supported options:
   *
   * - `windowBits`
   * - `dictionary`
   *
   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
   * for more information on these.
   *
   * Additional options, for internal needs:
   *
   * - `chunkSize` - size of generated data chunks (16K by default)
   * - `raw` (Boolean) - do raw inflate
   * - `to` (String) - if equal to 'string', then result will be converted
   *   from utf8 to utf16 (javascript) string. When string output requested,
   *   chunk length can differ from `chunkSize`, depending on content.
   *
   * By default, when no options set, autodetect deflate/gzip data format via
   * wrapper header.
   *
   * ##### Example:
   *
   * ```javascript
   * const pako = require('pako')
   * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
   * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
   *
   * const inflate = new pako.Inflate({ level: 3});
   *
   * inflate.push(chunk1, false);
   * inflate.push(chunk2, true);  // true -> last chunk
   *
   * if (inflate.err) { throw new Error(inflate.err); }
   *
   * console.log(inflate.result);
   * ```
   **/
  function Inflate$1(options) {
    this.options = common.assign({
      chunkSize: 1024 * 64,
      windowBits: 15,
      to: ''
    }, options || {});
    var opt = this.options;

    // Force window size for `raw` data, if not set directly,
    // because we have no header for autodetect.
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) {
        opt.windowBits = -15;
      }
    }

    // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
      opt.windowBits += 32;
    }

    // Gzip header has no info about windows size, we can do autodetect only
    // for deflate. So, if window size not set, force it to max when gzip possible
    if (opt.windowBits > 15 && opt.windowBits < 48) {
      // bit 3 (16) -> gzipped data
      // bit 4 (32) -> autodetect gzip/deflate
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }
    this.err = 0; // error code, if happens (0 = Z_OK)
    this.msg = ''; // error message
    this.ended = false; // used to avoid multiple onEnd() calls
    this.chunks = []; // chunks of compressed data

    this.strm = new zstream();
    this.strm.avail_out = 0;
    var status = inflate_1$2.inflateInit2(this.strm, opt.windowBits);
    if (status !== Z_OK) {
      throw new Error(messages[status]);
    }
    this.header = new gzheader();
    inflate_1$2.inflateGetHeader(this.strm, this.header);

    // Setup dictionary
    if (opt.dictionary) {
      // Convert data if needed
      if (typeof opt.dictionary === 'string') {
        opt.dictionary = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) {
        //In raw mode we need to set the dictionary early
        status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== Z_OK) {
          throw new Error(messages[status]);
        }
      }
    }
  }

  /**
   * Inflate#push(data[, flush_mode]) -> Boolean
   * - data (Uint8Array|ArrayBuffer): input data
   * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
   *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
   *   `true` means Z_FINISH.
   *
   * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
   * new output chunks. Returns `true` on success. If end of stream detected,
   * [[Inflate#onEnd]] will be called.
   *
   * `flush_mode` is not needed for normal operation, because end of stream
   * detected automatically. You may try to use it for advanced things, but
   * this functionality was not tested.
   *
   * On fail call [[Inflate#onEnd]] with error code and return false.
   *
   * ##### Example
   *
   * ```javascript
   * push(chunk, false); // push one of data chunks
   * ...
   * push(chunk, true);  // push last chunk
   * ```
   **/
  Inflate$1.prototype.push = function (data, flush_mode) {
    var strm = this.strm;
    var chunkSize = this.options.chunkSize;
    var dictionary = this.options.dictionary;
    var status, _flush_mode, last_avail_out;
    if (this.ended) return false;
    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;

    // Convert data if needed
    if (toString.call(data) === '[object ArrayBuffer]') {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (;;) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      status = inflate_1$2.inflate(strm, _flush_mode);
      if (status === Z_NEED_DICT && dictionary) {
        status = inflate_1$2.inflateSetDictionary(strm, dictionary);
        if (status === Z_OK) {
          status = inflate_1$2.inflate(strm, _flush_mode);
        } else if (status === Z_DATA_ERROR) {
          // Replace code with more verbose
          status = Z_NEED_DICT;
        }
      }

      // Skip snyc markers if more data follows and not raw mode
      while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {
        inflate_1$2.inflateReset(strm);
        status = inflate_1$2.inflate(strm, _flush_mode);
      }
      switch (status) {
        case Z_STREAM_ERROR:
        case Z_DATA_ERROR:
        case Z_NEED_DICT:
        case Z_MEM_ERROR:
          this.onEnd(status);
          this.ended = true;
          return false;
      }

      // Remember real `avail_out` value, because we may patch out buffer content
      // to align utf8 strings boundaries.
      last_avail_out = strm.avail_out;
      if (strm.next_out) {
        if (strm.avail_out === 0 || status === Z_STREAM_END) {
          if (this.options.to === 'string') {
            var next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
            var tail = strm.next_out - next_out_utf8;
            var utf8str = strings.buf2string(strm.output, next_out_utf8);

            // move tail & realign counters
            strm.next_out = tail;
            strm.avail_out = chunkSize - tail;
            if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
            this.onData(utf8str);
          } else {
            this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
          }
        }
      }

      // Must repeat iteration if out buffer is full
      if (status === Z_OK && last_avail_out === 0) continue;

      // Finalize if end of stream reached.
      if (status === Z_STREAM_END) {
        status = inflate_1$2.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return true;
      }
      if (strm.avail_in === 0) break;
    }
    return true;
  };

  /**
   * Inflate#onData(chunk) -> Void
   * - chunk (Uint8Array|String): output data. When string output requested,
   *   each chunk will be string.
   *
   * By default, stores data blocks in `chunks[]` property and glue
   * those in `onEnd`. Override this handler, if you need another behaviour.
   **/
  Inflate$1.prototype.onData = function (chunk) {
    this.chunks.push(chunk);
  };

  /**
   * Inflate#onEnd(status) -> Void
   * - status (Number): inflate status. 0 (Z_OK) on success,
   *   other if not.
   *
   * Called either after you tell inflate that the input stream is
   * complete (Z_FINISH). By default - join collected chunks,
   * free memory and fill `results` / `err` properties.
   **/
  Inflate$1.prototype.onEnd = function (status) {
    // On success - join
    if (status === Z_OK) {
      if (this.options.to === 'string') {
        this.result = this.chunks.join('');
      } else {
        this.result = common.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };

  /**
   * inflate(data[, options]) -> Uint8Array|String
   * - data (Uint8Array|ArrayBuffer): input data to decompress.
   * - options (Object): zlib inflate options.
   *
   * Decompress `data` with inflate/ungzip and `options`. Autodetect
   * format via wrapper header by default. That's why we don't provide
   * separate `ungzip` method.
   *
   * Supported options are:
   *
   * - windowBits
   *
   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
   * for more information.
   *
   * Sugar (options):
   *
   * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
   *   negative windowBits implicitly.
   * - `to` (String) - if equal to 'string', then result will be converted
   *   from utf8 to utf16 (javascript) string. When string output requested,
   *   chunk length can differ from `chunkSize`, depending on content.
   *
   *
   * ##### Example:
   *
   * ```javascript
   * const pako = require('pako');
   * const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
   * let output;
   *
   * try {
   *   output = pako.inflate(input);
   * } catch (err) {
   *   console.log(err);
   * }
   * ```
   **/
  function inflate$1(input, options) {
    var inflator = new Inflate$1(options);
    inflator.push(input);

    // That will never happens, if you don't cheat with options :)
    if (inflator.err) throw inflator.msg || messages[inflator.err];
    return inflator.result;
  }

  /**
   * inflateRaw(data[, options]) -> Uint8Array|String
   * - data (Uint8Array|ArrayBuffer): input data to decompress.
   * - options (Object): zlib inflate options.
   *
   * The same as [[inflate]], but creates raw data, without wrapper
   * (header and adler32 crc).
   **/
  function inflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return inflate$1(input, options);
  }

  /**
   * ungzip(data[, options]) -> Uint8Array|String
   * - data (Uint8Array|ArrayBuffer): input data to decompress.
   * - options (Object): zlib inflate options.
   *
   * Just shortcut to [[inflate]], because it autodetects format
   * by header.content. Done for convenience.
   **/

  var Inflate_1$1 = Inflate$1;
  var inflate_2 = inflate$1;
  var inflateRaw_1$1 = inflateRaw$1;
  var ungzip$1 = inflate$1;
  var constants = constants$2;
  var inflate_1$1 = {
    Inflate: Inflate_1$1,
    inflate: inflate_2,
    inflateRaw: inflateRaw_1$1,
    ungzip: ungzip$1,
    constants: constants
  };

  var Deflate = deflate_1$1.Deflate,
    deflate = deflate_1$1.deflate,
    deflateRaw = deflate_1$1.deflateRaw,
    gzip = deflate_1$1.gzip;
  var Inflate = inflate_1$1.Inflate,
    inflate = inflate_1$1.inflate,
    inflateRaw = inflate_1$1.inflateRaw,
    ungzip = inflate_1$1.ungzip;
  var Deflate_1 = Deflate;
  var deflate_1 = deflate;
  var deflateRaw_1 = deflateRaw;
  var gzip_1 = gzip;
  var Inflate_1 = Inflate;
  var inflate_1 = inflate;
  var inflateRaw_1 = inflateRaw;
  var ungzip_1 = ungzip;
  var constants_1 = constants$2;
  return {
    Deflate: Deflate_1,
    deflate: deflate_1,
    deflateRaw: deflateRaw_1,
    gzip: gzip_1,
    Inflate: Inflate_1,
    inflate: inflate_1,
    inflateRaw: inflateRaw_1,
    ungzip: ungzip_1,
    constants: constants_1
  };
})()

let bzip = (() => {
    

    var Stream = function() {
        /* ABSTRACT */
    };

{
   var EOF = -1;

    // you must define one of read / readByte for a readable stream
    Stream.prototype.readByte = function() {
        var buf = [ 0 ];
        var len = this.read(buf, 0, 1);
        if (len===0) { this._eof = true; return EOF; }
        return buf[0];
    };
    Stream.prototype.read = function(buf, bufOffset, length) {
        var ch, bytesRead = 0;
        while (bytesRead < length) {
            ch = this.readByte();
            if (ch === EOF) { this._eof = true; break; }
            buf[bufOffset+(bytesRead++)] = ch;
        }
        return bytesRead;
    };
    // reasonable default implementation of 'eof'
    Stream.prototype.eof = function() { return !!this._eof; };
    // not all readable streams are seekable
    Stream.prototype.seek = function(pos) {
        throw new Error('Stream is not seekable.');
    };
    Stream.prototype.tell = function() {
        throw new Error('Stream is not seekable.');
    };
    // you must define one of write / writeByte for a writable stream
    Stream.prototype.writeByte = function(_byte) {
        var buf = [ _byte ];
        this.write(buf, 0, 1);
    };
    Stream.prototype.write = function(buf, bufOffset, length) {
        var i;
        for (i=0; i<length; i++) {
            this.writeByte(buf[bufOffset + i]);
        }
        return length;
    };
    // flush will happily do nothing if you don't override it.
    Stream.prototype.flush = function() { };

    // export EOF as a constant.
    Stream.EOF = EOF;
}



      var Util = Object.create(null);

      {

    var EOF = Stream.EOF;

    /* Take a buffer, array, or stream, and return an input stream. */
    Util.coerceInputStream = function(input, forceRead) {
        if (!('readByte' in input)) {
            var buffer = input;
            input = new Stream();
            input.size = buffer.length;
            input.pos = 0;
            input.readByte = function() {
                if (this.pos >= this.size) { return EOF; }
                return buffer[this.pos++];
            };
            input.read = function(buf, bufOffset, length) {
                var bytesRead = 0;
                while (bytesRead < length && this.pos < buffer.length) {
                    buf[bufOffset++] = buffer[this.pos++];
                    bytesRead++;
                }
                return bytesRead;
            };
            input.seek = function(pos) { this.pos = pos; };
            input.tell = function() { return this.pos; };
            input.eof = function() { return this.pos >= buffer.length; };
        } else if (forceRead && !('read' in input)) {
            // wrap input if it doesn't implement read
            var s = input;
            input = new Stream();
            input.readByte = function() {
                var ch = s.readByte();
                if (ch === EOF) { this._eof = true; }
                return ch;
            };
            if ('size' in s) { input.size = s.size; }
            if ('seek' in s) {
                input.seek = function(pos) {
                    s.seek(pos); // may throw if s doesn't implement seek
                    this._eof = false;
                };
            }
            if ('tell' in s) {
                input.tell = s.tell.bind(s);
            }
        }
        return input;
    };

    var BufferStream = function(buffer, resizeOk) {
        this.buffer = buffer;
        this.resizeOk = resizeOk;
        this.pos = 0;
    };
    BufferStream.prototype = Object.create(Stream.prototype);
    BufferStream.prototype.writeByte = function(_byte) {
        if (this.resizeOk && this.pos >= this.buffer.length) {
            var newBuffer = Util.makeU8Buffer(this.buffer.length * 2);
            newBuffer.set(this.buffer);
            this.buffer = newBuffer;
        }
        this.buffer[this.pos++] = _byte;
    };
    BufferStream.prototype.getBuffer = function() {
        // trim buffer if needed
        if (this.pos !== this.buffer.length) {
            if (!this.resizeOk)
                throw new TypeError('outputsize does not match decoded input');
            var newBuffer = Util.makeU8Buffer(this.pos);
            newBuffer.set(this.buffer.subarray(0, this.pos));
            this.buffer = newBuffer;
        }
        return this.buffer;
    };

    /* Take a stream (or not) and an (optional) size, and return an
     * output stream.  Return an object with a 'retval' field equal to
     * the output stream (if that was given) or else a pointer at the
     * internal Uint8Array/buffer/array; and a 'stream' field equal to
     * an output stream to use.
     */
    Util.coerceOutputStream = function(output, size) {
        var r = { stream: output, retval: output };
        if (output) {
            if (typeof(output)==='object' && 'writeByte' in output) {
                return r; /* leave output alone */
            } else if (typeof(size) === 'number') {
                console.assert(size >= 0);
                r.stream = new BufferStream(Util.makeU8Buffer(size), false);
            } else { // output is a buffer
                r.stream = new BufferStream(output, false);
            }
        } else {
            r.stream = new BufferStream(Util.makeU8Buffer(16384), true);
        }
        Object.defineProperty(r, 'retval', {
            get: r.stream.getBuffer.bind(r.stream)
        });
        return r;
    };

    Util.compressFileHelper = function(magic, guts, suppressFinalByte) {
        return function(inStream, outStream, props) {
            inStream = Util.coerceInputStream(inStream);
            var o = Util.coerceOutputStream(outStream, outStream);
            outStream = o.stream;

            // write the magic number to identify this file type
            // (it better be ASCII, we're not doing utf-8 conversion)
            var i;
            for (i=0; i<magic.length; i++) {
                outStream.writeByte(magic.charCodeAt(i));
            }

            // if we know the size, write it
            var fileSize;
            if ('size' in inStream && inStream.size >= 0) {
                fileSize = inStream.size;
            } else {
                fileSize = -1; // size unknown
            }
            if (suppressFinalByte) {
                var tmpOutput = Util.coerceOutputStream([]);
                Util.writeUnsignedNumber(tmpOutput.stream, fileSize + 1);
                tmpOutput = tmpOutput.retval;
                for (i=0; i<tmpOutput.length-1; i++) {
                    outStream.writeByte(tmpOutput[i]);
                }
                suppressFinalByte = tmpOutput[tmpOutput.length-1];
            } else {
                Util.writeUnsignedNumber(outStream, fileSize + 1);
            }

            // call the guts to do the real compression
            guts(inStream, outStream, fileSize, props, suppressFinalByte);

            return o.retval;
        };
    };
    Util.decompressFileHelper = function(magic, guts) {
        return function(inStream, outStream) {
            inStream = Util.coerceInputStream(inStream);

            // read the magic number to confirm this file type
            // (it better be ASCII, we're not doing utf-8 conversion)
            var i;
            for (i=0; i<magic.length; i++) {
                if (magic.charCodeAt(i) !== inStream.readByte()) {
                    throw new Error("Bad magic");
                }
            }

            // read the file size & create an appropriate output stream/buffer
            var fileSize = Util.readUnsignedNumber(inStream) - 1;
            var o = Util.coerceOutputStream(outStream, fileSize);
            outStream = o.stream;

            // call the guts to do the real decompression
            guts(inStream, outStream, fileSize);

            return o.retval;
        };
    };
    // a helper for simple self-test of model encode
    Util.compressWithModel = function(inStream, fileSize, model) {
        var inSize = 0;
        while (inSize !== fileSize) {
            var ch = inStream.readByte();
            if (ch === EOF) {
                model.encode(256); // end of stream;
                break;
            }
            model.encode(ch);
            inSize++;
        }
    };
    // a helper for simple self-test of model decode
    Util.decompressWithModel = function(outStream, fileSize, model) {
        var outSize = 0;
        while (outSize !== fileSize) {
            var ch = model.decode();
            if (ch === 256) {
                break; // end of stream;
            }
            outStream.writeByte(ch);
            outSize++;
        }
    };

    /** Write a number using a self-delimiting big-endian encoding. */
    Util.writeUnsignedNumber = function(output, n) {
        console.assert(n >= 0);
        var bytes = [], i;
        do {
            bytes.push(n & 0x7F);
            // use division instead of shift to allow encoding numbers up to
            // 2^53
            n = Math.floor( n / 128 );
        } while (n !== 0);
        bytes[0] |= 0x80; // mark end of encoding.
        for (i=bytes.length-1; i>=0; i--) {
            output.writeByte(bytes[i]); // write in big-endian order
        }
        return output;
    };

    /** Read a number using a self-delimiting big-endian encoding. */
    Util.readUnsignedNumber = function(input) {
        var n = 0, c;
        while (true) {
            c = input.readByte();
            if (c&0x80) { n += (c&0x7F); break; }
            // using + and * instead of << allows decoding numbers up to 2^53
            n = (n + c) * 128;
        }
        return n;
    };

    // Compatibility thunks for Buffer/TypedArray constructors.

    var zerofill = function(a) {
        for (var i = 0, len = a.length; i < len; i++) {
            a[i] = 0;
        }
        return a;
    };

    var fallbackarray = function(size) {
        return zerofill(new Array(size));
    };

    // Node 0.11.6 - 0.11.10ish don't properly zero fill typed arrays.
    // See https://github.com/joyent/node/issues/6664
    // Try to detect and workaround the bug.
    var ensureZeroed = function id(a) { return a; };
    if ((typeof(process) !== 'undefined') &&
        Array.prototype.some.call(new Uint32Array(128), function(x) {
            return x !== 0;
        })) {
        //console.warn('Working around broken TypedArray');
        ensureZeroed = zerofill;
    }

    /** Portable 8-bit unsigned buffer. */
    Util.makeU8Buffer = (typeof(Uint8Array) !== 'undefined') ? function(size) {
        // Uint8Array ought to be  automatically zero-filled
        return ensureZeroed(new Uint8Array(size));
    } : (typeof(Buffer) !== 'undefined') ? function(size) {
        var b = new Buffer(size);
        b.fill(0);
        return b;
    } : fallbackarray;

    /** Portable 16-bit unsigned buffer. */
    Util.makeU16Buffer = (typeof(Uint16Array) !== 'undefined') ? function(size) {
        // Uint16Array ought to be  automatically zero-filled
        return ensureZeroed(new Uint16Array(size));
    } : fallbackarray;

    /** Portable 32-bit unsigned buffer. */
    Util.makeU32Buffer = (typeof(Uint32Array) !== 'undefined') ? function(size) {
        // Uint32Array ought to be  automatically zero-filled
        return ensureZeroed(new Uint32Array(size));
    } : fallbackarray;

    /** Portable 32-bit signed buffer. */
    Util.makeS32Buffer = (typeof(Int32Array) !== 'undefined') ? function(size) {
        // Int32Array ought to be  automatically zero-filled
        return ensureZeroed(new Int32Array(size));
    } : fallbackarray;

    Util.arraycopy = function(dst, src) {
        console.assert(dst.length >= src.length);
        for (var i = 0, len = src.length; i < len ; i++) {
            dst[i] = src[i];
        }
        return dst;
    };

    /** Highest bit set in a byte. */
    var bytemsb = [
        0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7,
        7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
        7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
        7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8 /* 256 */
    ];
    console.assert(bytemsb.length===0x100);
    /** Find last set (most significant bit).
     *  @return the last bit set in the argument.
     *          <code>fls(0)==0</code> and <code>fls(1)==1</code>. */
    var fls = Util.fls = function(v) {
        console.assert(v>=0);
        if (v > 0xFFFFFFFF) { // use floating-point mojo
            return 32 + fls(Math.floor(v / 0x100000000));
        }
        if ( (v & 0xFFFF0000) !== 0) {
            if ( (v & 0xFF000000) !== 0) {
                return 24 + bytemsb[(v>>>24) & 0xFF];
            } else {
                return 16 + bytemsb[v>>>16];
            }
        } else if ( (v & 0x0000FF00) !== 0) {
            return 8 + bytemsb[v>>>8];
        } else {
            return bytemsb[v];
        }
    };
    /** Returns ceil(log2(n)) */
    Util.log2c = function(v) {
        return (v===0)?-1:fls(v-1);
    };

    }




  /**
   * FIRST() function
   * @param array The code length array
   * @param i The input position
   * @param nodesToMove The number of internal nodes to be relocated
   * @return The smallest {@code k} such that {@code nodesToMove <= k <= i} and
   *         {@code i <= (array[k] % array.length)}
   */
  var first = function(array, i, nodesToMove) {
    var length = array.length;
    var limit = i;
    var k = array.length - 2;

    while ((i >= nodesToMove) && ((array[i] % length) > limit)) {
      k = i;
      i -= (limit - i + 1);
    }
    i = Math.max (nodesToMove - 1, i);

    while (k > (i + 1)) {
      var temp = (i + k) >> 1;
      if ((array[temp] % length) > limit) {
        k = temp;
      } else {
        i = temp;
      }
    }

    return k;
  };

  /**
   * Fills the code array with extended parent pointers
   * @param array The code length array
   */
  var setExtendedParentPointers = function(array) {
    var length = array.length;

    array[0] += array[1];

    var headNode, tailNode, topNode, temp;
    for (headNode = 0, tailNode = 1, topNode = 2;
         tailNode < (length - 1);
         tailNode++) {
      if ((topNode >= length) || (array[headNode] < array[topNode])) {
        temp = array[headNode];
        array[headNode++] = tailNode;
      } else {
        temp = array[topNode++];
      }

      if ((topNode >= length) ||
          ((headNode < tailNode) && (array[headNode] < array[topNode]))) {
        temp += array[headNode];
        array[headNode++] = tailNode + length;
      } else {
        temp += array[topNode++];
      }

      array[tailNode] = temp;
    }
  };

  /**
   * Finds the number of nodes to relocate in order to achieve a given code
   * length limit
   * @param array The code length array
   * @param maximumLength The maximum bit length for the generated codes
   * @return The number of nodes to relocate
   */
  var findNodesToRelocate = function(array, maximumLength) {
    var currentNode = array.length - 2;
    var currentDepth;
    for (currentDepth = 1;
         (currentDepth < (maximumLength - 1)) && (currentNode > 1);
         currentDepth++) {
      currentNode =  first (array, currentNode - 1, 0);
    }

    return currentNode;
  };


  /**
   * A final allocation pass with no code length limit
   * @param array The code length array
   */
  var allocateNodeLengths = function(array) {
    var firstNode = array.length - 2;
    var nextNode = array.length - 1;
    var currentDepth, availableNodes, lastNode, i;

    for (currentDepth = 1, availableNodes = 2;
         availableNodes > 0;
         currentDepth++) {
      lastNode = firstNode;
      firstNode = first (array, lastNode - 1, 0);

      for (i = availableNodes - (lastNode - firstNode); i > 0; i--) {
        array[nextNode--] = currentDepth;
      }

      availableNodes = (lastNode - firstNode) << 1;
    }
  };

  /**
   * A final allocation pass that relocates nodes in order to achieve a
   * maximum code length limit
   * @param array The code length array
   * @param nodesToMove The number of internal nodes to be relocated
   * @param insertDepth The depth at which to insert relocated nodes
   */
  var allocateNodeLengthsWithRelocation = function(array, nodesToMove,
                                                   insertDepth) {
    var firstNode = array.length - 2;
    var nextNode = array.length - 1;
    var currentDepth = (insertDepth == 1) ? 2 : 1;
    var nodesLeftToMove = (insertDepth == 1) ? nodesToMove - 2 : nodesToMove;
    var availableNodes, lastNode, offset, i;

    for (availableNodes = currentDepth << 1;
         availableNodes > 0;
         currentDepth++) {
      lastNode = firstNode;
      firstNode = (firstNode <= nodesToMove) ? firstNode : first (array, lastNode - 1, nodesToMove);

      offset = 0;
      if (currentDepth >= insertDepth) {
        offset = Math.min (nodesLeftToMove, 1 << (currentDepth - insertDepth));
      } else if (currentDepth == (insertDepth - 1)) {
        offset = 1;
        if ((array[firstNode]) == lastNode) {
          firstNode++;
        }
      }

      for (i = availableNodes - (lastNode - firstNode + offset); i > 0; i--) {
        array[nextNode--] = currentDepth;
      }

      nodesLeftToMove -= offset;
      availableNodes = (lastNode - firstNode + offset) << 1;
    }
  };

  /**
   * Allocates Canonical Huffman code lengths in place based on a sorted
   * frequency array
   * @param array On input, a sorted array of symbol frequencies; On output,
   *              an array of Canonical Huffman code lengths
   * @param maximumLength The maximum code length. Must be at least
   *                      {@code ceil(log2(array.length))}
   */
  // public
  var allocateHuffmanCodeLengths = function(array, maximumLength) {
    switch (array.length) {
    case 2:
      array[1] = 1;
    case 1:
      array[0] = 1;
      return;
    }

    /* Pass 1 : Set extended parent pointers */
    setExtendedParentPointers (array);

    /* Pass 2 : Find number of nodes to relocate in order to achieve
     *          maximum code length */
    var nodesToRelocate = findNodesToRelocate (array, maximumLength);

    /* Pass 3 : Generate code lengths */
    if ((array[0] % array.length) >= nodesToRelocate) {
      allocateNodeLengths (array);
    } else {
      var insertDepth = maximumLength - (Util.fls(nodesToRelocate - 1));
      allocateNodeLengthsWithRelocation (array, nodesToRelocate, insertDepth);
    }
  };






  /**
   * A static CRC lookup table
   */
    var crc32Lookup = Util.arraycopy(Util.makeU32Buffer(256), [
    0x00000000, 0x04c11db7, 0x09823b6e, 0x0d4326d9, 0x130476dc, 0x17c56b6b, 0x1a864db2, 0x1e475005,
    0x2608edb8, 0x22c9f00f, 0x2f8ad6d6, 0x2b4bcb61, 0x350c9b64, 0x31cd86d3, 0x3c8ea00a, 0x384fbdbd,
    0x4c11db70, 0x48d0c6c7, 0x4593e01e, 0x4152fda9, 0x5f15adac, 0x5bd4b01b, 0x569796c2, 0x52568b75,
    0x6a1936c8, 0x6ed82b7f, 0x639b0da6, 0x675a1011, 0x791d4014, 0x7ddc5da3, 0x709f7b7a, 0x745e66cd,
    0x9823b6e0, 0x9ce2ab57, 0x91a18d8e, 0x95609039, 0x8b27c03c, 0x8fe6dd8b, 0x82a5fb52, 0x8664e6e5,
    0xbe2b5b58, 0xbaea46ef, 0xb7a96036, 0xb3687d81, 0xad2f2d84, 0xa9ee3033, 0xa4ad16ea, 0xa06c0b5d,
    0xd4326d90, 0xd0f37027, 0xddb056fe, 0xd9714b49, 0xc7361b4c, 0xc3f706fb, 0xceb42022, 0xca753d95,
    0xf23a8028, 0xf6fb9d9f, 0xfbb8bb46, 0xff79a6f1, 0xe13ef6f4, 0xe5ffeb43, 0xe8bccd9a, 0xec7dd02d,
    0x34867077, 0x30476dc0, 0x3d044b19, 0x39c556ae, 0x278206ab, 0x23431b1c, 0x2e003dc5, 0x2ac12072,
    0x128e9dcf, 0x164f8078, 0x1b0ca6a1, 0x1fcdbb16, 0x018aeb13, 0x054bf6a4, 0x0808d07d, 0x0cc9cdca,
    0x7897ab07, 0x7c56b6b0, 0x71159069, 0x75d48dde, 0x6b93dddb, 0x6f52c06c, 0x6211e6b5, 0x66d0fb02,
    0x5e9f46bf, 0x5a5e5b08, 0x571d7dd1, 0x53dc6066, 0x4d9b3063, 0x495a2dd4, 0x44190b0d, 0x40d816ba,
    0xaca5c697, 0xa864db20, 0xa527fdf9, 0xa1e6e04e, 0xbfa1b04b, 0xbb60adfc, 0xb6238b25, 0xb2e29692,
    0x8aad2b2f, 0x8e6c3698, 0x832f1041, 0x87ee0df6, 0x99a95df3, 0x9d684044, 0x902b669d, 0x94ea7b2a,
    0xe0b41de7, 0xe4750050, 0xe9362689, 0xedf73b3e, 0xf3b06b3b, 0xf771768c, 0xfa325055, 0xfef34de2,
    0xc6bcf05f, 0xc27dede8, 0xcf3ecb31, 0xcbffd686, 0xd5b88683, 0xd1799b34, 0xdc3abded, 0xd8fba05a,
    0x690ce0ee, 0x6dcdfd59, 0x608edb80, 0x644fc637, 0x7a089632, 0x7ec98b85, 0x738aad5c, 0x774bb0eb,
    0x4f040d56, 0x4bc510e1, 0x46863638, 0x42472b8f, 0x5c007b8a, 0x58c1663d, 0x558240e4, 0x51435d53,
    0x251d3b9e, 0x21dc2629, 0x2c9f00f0, 0x285e1d47, 0x36194d42, 0x32d850f5, 0x3f9b762c, 0x3b5a6b9b,
    0x0315d626, 0x07d4cb91, 0x0a97ed48, 0x0e56f0ff, 0x1011a0fa, 0x14d0bd4d, 0x19939b94, 0x1d528623,
    0xf12f560e, 0xf5ee4bb9, 0xf8ad6d60, 0xfc6c70d7, 0xe22b20d2, 0xe6ea3d65, 0xeba91bbc, 0xef68060b,
    0xd727bbb6, 0xd3e6a601, 0xdea580d8, 0xda649d6f, 0xc423cd6a, 0xc0e2d0dd, 0xcda1f604, 0xc960ebb3,
    0xbd3e8d7e, 0xb9ff90c9, 0xb4bcb610, 0xb07daba7, 0xae3afba2, 0xaafbe615, 0xa7b8c0cc, 0xa379dd7b,
    0x9b3660c6, 0x9ff77d71, 0x92b45ba8, 0x9675461f, 0x8832161a, 0x8cf30bad, 0x81b02d74, 0x857130c3,
    0x5d8a9099, 0x594b8d2e, 0x5408abf7, 0x50c9b640, 0x4e8ee645, 0x4a4ffbf2, 0x470cdd2b, 0x43cdc09c,
    0x7b827d21, 0x7f436096, 0x7200464f, 0x76c15bf8, 0x68860bfd, 0x6c47164a, 0x61043093, 0x65c52d24,
    0x119b4be9, 0x155a565e, 0x18197087, 0x1cd86d30, 0x029f3d35, 0x065e2082, 0x0b1d065b, 0x0fdc1bec,
    0x3793a651, 0x3352bbe6, 0x3e119d3f, 0x3ad08088, 0x2497d08d, 0x2056cd3a, 0x2d15ebe3, 0x29d4f654,
    0xc5a92679, 0xc1683bce, 0xcc2b1d17, 0xc8ea00a0, 0xd6ad50a5, 0xd26c4d12, 0xdf2f6bcb, 0xdbee767c,
    0xe3a1cbc1, 0xe760d676, 0xea23f0af, 0xeee2ed18, 0xf0a5bd1d, 0xf464a0aa, 0xf9278673, 0xfde69bc4,
    0x89b8fd09, 0x8d79e0be, 0x803ac667, 0x84fbdbd0, 0x9abc8bd5, 0x9e7d9662, 0x933eb0bb, 0x97ffad0c,
    0xafb010b1, 0xab710d06, 0xa6322bdf, 0xa2f33668, 0xbcb4666d, 0xb8757bda, 0xb5365d03, 0xb1f740b4
  ]);

  var CRC32 = function() {
    /**
     * The current CRC
     */
    var crc = 0xffffffff;

    /**
     * @return The current CRC
     */
    this.getCRC = function() {
      return (~crc) >>> 0; // return an unsigned value
    };

    /**
     * Update the CRC with a single byte
     * @param value The value to update the CRC with
     */
    this.updateCRC = function(value) {
      crc = (crc << 8) ^ crc32Lookup[((crc >>> 24) ^ value) & 0xff];
    };

    /**
     * Update the CRC with a sequence of identical bytes
     * @param value The value to update the CRC with
     * @param count The number of bytes
     */
    this.updateCRCRun = function(value, count) {
      while (count-- > 0) {
        crc = (crc << 8) ^ crc32Lookup[((crc >>> 24) ^ value) & 0xff];
      }
    };
  };


var ASSERT = console.assert.bind(console);

// we're dispensing with the "arbitrary alphabet" stuff of the source
// and just using Uint8Arrays.

/** Find the start or end of each bucket. */
var getCounts = function(T, C, n, k) {
    var i;
    for (i = 0; i < k; i++) { C[i] = 0; }
    for (i = 0; i < n; i++) { C[T[i]]++; }
};
var getBuckets = function(C, B, k, end) {
    var i, sum = 0;
    if (end) {
        for (i = 0; i < k; i++) { sum += C[i]; B[i] = sum; }
    } else {
        for (i = 0; i < k; i++) { sum += C[i]; B[i] = sum - C[i]; }
    }
};

/** Sort all type LMS suffixes */
var LMSsort = function(T, SA, C, B, n, k) {
    var b, i, j;
    var c0, c1;
    /* compute SAl */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, false); /* find starts of buckets */
    j = n - 1;
    b = B[c1 = T[j]];
    j--;
    SA[b++] = (T[j] < c1) ? ~j : j;
    for (i = 0; i < n; i++) {
        if ((j = SA[i]) > 0) {
            ASSERT(T[j] >= T[j+1]);
            if ((c0 = T[j]) !== c1) { B[c1] = b; b = B[c1 = c0]; }
            ASSERT(i < b);
            j--;
            SA[b++] = (T[j] < c1) ? ~j : j;
            SA[i] = 0;
        } else if (j < 0) {
            SA[i] = ~j;
        }
    }
    /* compute SAs */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, 1); /* find ends of buckets */
    for (i = n-1, b = B[c1 = 0]; i >= 0; i--) {
        if ((j = SA[i]) > 0) {
            ASSERT(T[j] <= T[j+1]);
            if ((c0 = T[j]) !== c1) { B[c1] = b; b = B[c1 = c0]; }
            ASSERT(b <= i);
            j--;
            SA[--b] = (T[j] > c1) ? ~(j+1) : j;
            SA[i] = 0;
        }
    }
};

var LMSpostproc = function(T, SA, n, m) {
    var i, j, p, q, plen, qlen, name;
    var c0, c1;
    var diff;

    /* compact all the sorted substrings into the first m items of SA
        * 2*m must not be larger than n (provable) */
    ASSERT(n > 0);
    for (i = 0; (p = SA[i]) < 0; i++) { SA[i] = ~p; ASSERT((i+1) < n); }
    if (i < m) {
        for (j = i, i++; ; i++) {
            ASSERT(i < n);
            if ((p = SA[i]) < 0) {
                SA[j++] = ~p; SA[i] = 0;
                if (j === m) { break; }
            }
        }
    }

    /* store the length of all substrings */
    c0 = T[i = j = n - 1];
    do { c1 = c0; } while ( ((--i) >= 0 ) && ((c0=T[i]) >= c1) );
    for (; i >= 0; ) {
        do { c1 = c0; } while ( ((--i) >= 0 ) && ((c0=T[i]) <= c1) );
        if (i >= 0) {
            SA[m + ((i + 1) >>> 1)] = j - i; j = i + 1;
            do { c1 = c0; } while ( ((--i) >= 0 ) && ((c0=T[i]) >= c1) );
        }
    }

    /* find the lexicographic names of all substrings */
    for (i = 0, name = 0, q = n, qlen = 0; i < m; i++) {
        p = SA[i]; plen = SA[m + (p >>> 1)]; diff = true;
        if ((plen === qlen) && ((q + plen) < n)) {
            for (j = 0; (j < plen) && (T[p + j] === T[q + j]); ) { j++; }
            if (j === plen) { diff = false; }
        }
        if (diff) { name++; q = p; qlen = plen; }
        SA[m + (p >>> 1)] = name;
    }

    return name;
};

/* compute SA and BWT */
var induceSA = function(T, SA, C, B, n, k) {
    var b, i, j;
    var c0, c1;
    /* compute SAl */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, false); /* find starts of buckets */
    j = n - 1;
    b = B[c1 = T[j]];
    SA[b++] = ((j > 0) && (T[j-1] < c1)) ? ~j : j;
    for (i = 0; i < n; i++) {
        j = SA[i]; SA[i] = ~j;
        if (j > 0) {
            j--;
            ASSERT( T[j] >= T[j + 1] );
            if ((c0 = T[j]) !== c1) { B[c1]  = b; b = B[c1=c0]; }
            ASSERT( i < b );
            SA[b++] = ((j > 0) && (T[j-1] < c1)) ? ~j : j;
        }
    }
    /* compute SAs */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, true); /* find ends of buckets */
    for (i = n-1, b = B[c1 = 0]; i >= 0; i--) {
        if ((j = SA[i]) > 0) {
            j--;
            ASSERT( T[j] <= T[j + 1] );
            if ((c0 = T[j]) !== c1) { B[c1] = b; b = B[c1 = c0]; }
            ASSERT( b <= i );
            SA[--b] = ((j === 0) || (T[j - 1] > c1)) ? ~j : j;
        } else {
            SA[i] = ~j;
        }
    }
};

var computeBWT = function(T, SA, C, B, n, k) {
    var b, i, j, pidx = -1;
    var c0, c1;
    /* compute SAl */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, false); /* find starts of buckets */
    j = n - 1;
    b = B[c1 = T[j]];
    SA[b++] = ((j > 0) && (T[j - 1] < c1)) ? ~j : j;
    for (i = 0; i < n; i++) {
        if ((j=SA[i]) > 0) {
            j--;
            ASSERT( T[j] >= T[j+1] );
            SA[i] = ~(c0 = T[j]);
            if (c0 !== c1) { B[c1] = b; b = B[c1 = c0]; }
            ASSERT( i < b );
            SA[b++] = ((j > 0) && (T[j - 1] < c1)) ? ~j : j;
        } else if (j !== 0) {
            SA[i] = ~j;
        }
    }
    /* compute SAs */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, true); /* find ends of buckets */
    for (i = n-1, b = B[c1 = 0]; i >= 0; i--) {
        if ((j = SA[i]) > 0) {
            j--;
            ASSERT( T[j] <= T[j+1] );
            SA[i] = c0 = T[j];
            if (c0 !== c1) { B[c1] = b; b = B[c1 = c0]; }
            ASSERT( b <= i );
            SA[--b] = ((j > 0) && (T[j-1] > c1)) ? (~T[j-1]) : j;
        } else if (j !== 0) {
            SA[i] = ~j;
        } else {
            pidx = i;
        }
    }
    return pidx;
};

/* find the suffix array SA of T[0..n-1] in {0..k-1}^n
    use a working space (excluding T and SA) of at most 2n+O(1) for a
    constant alphabet */
var SA_IS = function(T, SA, fs, n, k, isbwt) {
    var C, B, RA;
    var i, j, b, c, m, p, q, name, pidx = 0, newfs;
    var c0, c1;
    var flags = 0;

    // allocate temporary storage [CSA]
    if (k <= 256) {
        C = Util.makeS32Buffer(k);
        if (k <= fs) { B = SA.subarray(n + fs - k); flags = 1; }
        else { B = Util.makeS32Buffer(k); flags = 3; }
    } else if (k <= fs) {
        C = SA.subarray(n + fs - k);
        if (k <= (fs - k)) { B = SA.subarray(n + fs - k * 2); flags = 0; }
        else if (k <= 1024) { B = Util.makeS32Buffer(k); flags = 2; }
        else { B = C; flags = 8; }
    } else {
        C = B = Util.makeS32Buffer(k);
        flags = 4 | 8;
    }

    /* stage 1: reduce the problem by at least 1/2
        sort all the LMS-substrings */
    getCounts(T, C, n, k);
    getBuckets(C, B, k, true); /* find ends of buckets */
    for (i = 0; i < n; i++) { SA[i] = 0; }
    b = -1; i = n - 1; j = n; m = 0; c0 = T[n - 1];
    do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) >= c1));
    for (; i >= 0 ;) {
        do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) <= c1));
        if ( i >= 0 ) {
            if ( b >= 0 ) { SA[b] = j; }
            b = --B[c1];
            j = i;
            ++m;
            do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) >= c1));
        }
    }

    if (m > 1) {
        LMSsort(T, SA, C, B, n, k);
        name = LMSpostproc(T, SA, n, m);
    } else if (m === 1) {
        SA[b] = j + 1;
        name = 1;
    } else {
        name = 0;
    }

    /* stage 2: solve the reduced problem
        recurse if names are not yet unique */
    if(name < m) {
        if((flags & 4) !== 0) { C = null; B = null; }
        if((flags & 2) !== 0) { B = null; }
        newfs = (n + fs) - (m * 2);
        if((flags & (1 | 4 | 8)) === 0) {
            if((k + name) <= newfs) { newfs -= k; }
            else { flags |= 8; }
        }
        ASSERT( (n >>> 1) <= (newfs + m) );
        for (i = m + (n >>> 1) - 1, j = m * 2 + newfs - 1; m <= i; i--) {
            if(SA[i] !== 0) { SA[j--] = SA[i] - 1; }
        }
        RA = SA.subarray(m + newfs);
        SA_IS(RA, SA, newfs, m, name, false);
        RA = null;

        i = n - 1; j = m * 2 - 1; c0 = T[n - 1];
        do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) >= c1));
        for (; i >= 0 ;) {
            do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) <= c1));
            if ( i >= 0 ) {
                SA[j--] = i + 1;
                do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) >= c1));
            }
        }

        for (i = 0; i < m; i++) { SA[i] = SA[m + SA[i]]; }
        if((flags & 4) !== 0) { C = B = Util.makeS32Buffer(k); }
        if((flags & 2) !== 0) { B = Util.makeS32Buffer(k); }
    }

    /* stage 3: induce the result for the original problem */
    if((flags & 8) !== 0) { getCounts(T, C, n, k); }
    /* put all left-most S characters into their buckets */
    if (m > 1) {
        getBuckets(C, B, k, true); /* find ends of buckets */
        i = m - 1; j = n; p = SA[m - 1]; c1 = T[p];
        do {
            q = B[c0 = c1];
            while (q < j) { SA[--j] = 0; }
            do {
                SA[--j] = p;
                if(--i < 0) { break; }
                p = SA[i];
            } while((c1 = T[p]) === c0);
        } while (i >= 0 );
        while ( j > 0 ) { SA[--j] = 0; }
    }
    if (!isbwt) { induceSA(T, SA, C, B, n, k); }
    else { pidx = computeBWT(T, SA, C, B, n, k); }
    C = null; B = null;
    return pidx;
};

var BWT = Object.create(null);
/** SA should be a Int32Array (signed!); T can be any typed array.
 *  alphabetSize is optional if T is an Uint8Array or Uint16Array. */
BWT.suffixsort = function(T, SA, n, alphabetSize) {
    ASSERT( T && SA && T.length >= n && SA.length >= n );
    if (n <= 1) {
        if (n === 1) { SA[0] = 0; }
        return 0;
    }
    if (!alphabetSize) {
        if (T.BYTES_PER_ELEMENT === 1) { alphabetSize = 256; }
        else if (T.BYTES_PER_ELEMENT === 2) { alphabetSize = 65536; }
        else throw new Error('Need to specify alphabetSize');
    }
    ASSERT( alphabetSize > 0 );
    if (T.BYTES_PER_ELEMENT) {
        ASSERT( alphabetSize <= (1 << (T.BYTES_PER_ELEMENT*8) ) );
    }
    return SA_IS(T, SA, 0, n, alphabetSize, false);
};
/** Burrows-Wheeler Transform.
    A should be Int32Array (signed!); T can be any typed array.
    U is the same type as T (it is used for output).
    alphabetSize is optional if T is an Uint8Array or Uint16Array.
    ASSUMES STRING IS TERMINATED WITH AN EOF CHARACTER.
*/
BWT.bwtransform = function(T, U, A, n, alphabetSize) {
    var i, pidx;
    ASSERT( T && U && A );
    ASSERT( T.length >= n && U.length >= n && A.length >= n );
    if (n <= 1) {
        if (n === 1) { U[0] = T[0]; }
        return n;
    }
    if (!alphabetSize) {
        if (T.BYTES_PER_ELEMENT === 1) { alphabetSize = 256; }
        else if (T.BYTES_PER_ELEMENT === 2) { alphabetSize = 65536; }
        else throw new Error('Need to specify alphabetSize');
    }
    ASSERT( alphabetSize > 0 );
    if (T.BYTES_PER_ELEMENT) {
        ASSERT( alphabetSize <= (1 << (T.BYTES_PER_ELEMENT*8) ) );
    }
    pidx = SA_IS(T, A, 0, n, alphabetSize, true);
    U[0] = T[n - 1];
    for (i = 0; i < pidx ; i++) { U[i + 1] = A[i]; }
    for (i += 1; i < n; i++) { U[i] = A[i]; }
    return pidx + 1;
};
/** Reverses transform above. (ASSUMED STRING IS TERMINATED WITH EOF.) */
BWT.unbwtransform = function(T, U, LF, n, pidx) {
    var C = Util.makeU32Buffer(256);
    var i, t;
    for (i=0; i<256; i++) { C[i] = 0; }
    for (i=0; i<n; i++) { LF[i] = C[T[i]]++; }
    for (i=0, t=0; i<256; i++) { t += C[i]; C[i] = t - C[i]; }
    for (i=n-1, t=0; i>=0; i--) {
        t = LF[t] + C[U[i]=T[t]];
        t += (t<pidx) ? 1 : 0;
    }
    C = null;
};

/** Burrows-Wheeler Transform.
    A should be Int32Array (signed!); T can be any typed array.
    U is the same type as T (it is used for output).
    alphabetSize is optional if T is an Uint8Array or Uint16Array.
    ASSUMES STRING IS CYCLIC.
    (XXX: this is twice as inefficient as I'd like! [CSA])
*/
BWT.bwtransform2 = function(T, U, n, alphabetSize) {
    var i, j, pidx = 0;
    ASSERT( T && U );
    ASSERT( T.length >= n && U.length >= n );
    if (n <= 1) {
        if (n === 1) { U[0] = T[0]; }
        return 0;
    }
    if (!alphabetSize) {
        if (T.BYTES_PER_ELEMENT === 1) { alphabetSize = 256; }
        else if (T.BYTES_PER_ELEMENT === 2) { alphabetSize = 65536; }
        else throw new Error('Need to specify alphabetSize');
    }
    ASSERT( alphabetSize > 0 );
    if (T.BYTES_PER_ELEMENT) {
        ASSERT( alphabetSize <= (1 << (T.BYTES_PER_ELEMENT*8) ) );
    }
    // double length of T
    var TT;
    if (T.length >= n*2) {
        TT = T; // do it in place if possible
    } else if (alphabetSize <= 256) {
        TT = Util.makeU8Buffer(n*2);
    } else if (alphabetSize <= 65536) {
        TT = Util.makeU16Buffer(n*2);
    } else {
        TT = Util.makeU32Buffer(n*2);
    }
    if (TT!==T) {
        for (i=0; i<n; i++) { TT[i] = T[i]; }
    }
    for (i=0; i<n; i++) { TT[n+i] = TT[i]; }
    // sort doubled string
    var A = Util.makeS32Buffer(n*2);
    SA_IS(TT, A, 0, n*2, alphabetSize, false);
    for (i=0, j=0; i<2*n; i++) {
        var s = A[i];
        if (s < n) {
            if (s === 0) { pidx = j; }
            if (--s < 0) { s = n-1; }
            U[j++] = T[s];
        }
    }
    ASSERT(j===n);
    return pidx;
};




var BitStream = function(stream) {
    (function() {
        var bufferByte = 0x100; // private var for readers
        this.readBit = function() {
            if ((bufferByte & 0xFF) === 0) {
                var ch = stream.readByte();
                if (ch === Stream.EOF) {
                    this._eof = true;
                    return ch; /* !!! */
                }
                bufferByte = (ch << 1) | 1;
            }
            var bit = (bufferByte & 0x100) ? 1 : 0;
            bufferByte <<= 1;
            return bit;
        };
        // seekable iff the provided stream is
        this.seekBit = function(pos) {
            var n_byte = pos >>> 3;
            var n_bit = pos - (n_byte*8);
            this.seek(n_byte);
            this._eof = false;
            this.readBits(n_bit);
        };
        this.tellBit = function() {
            var pos = stream.tell() * 8;
            var b = bufferByte;
            while ((b & 0xFF) !== 0) {
                pos--;
                b <<= 1;
            }
            return pos;
        };
        // implement byte stream interface as well.
        this.readByte = function() {
            if ((bufferByte & 0xFF) === 0) {
                return stream.readByte();
            }
            return this.readBits(8);
        };
        this.seek = function(pos) {
            stream.seek(pos);
            bufferByte = 0x100;
        };
    }).call(this);
    (function() {
        var bufferByte = 1; // private var for writers
        this.writeBit = function(b) {
            bufferByte <<= 1;
            if (b) { bufferByte |= 1; }
            if (bufferByte & 0x100) {
                stream.writeByte(bufferByte & 0xFF);
                bufferByte = 1;
            }
        };
        // implement byte stream interface as well
        this.writeByte = function(_byte) {
            if (bufferByte===1) {
                stream.writeByte(_byte);
            } else {
                stream.writeBits(8, _byte);
            }
        };
        this.flush = function() {
            while (bufferByte !== 1) {
                this.writeBit(0);
            }
            if (stream.flush) { stream.flush(); }
        };
    }).call(this);
};
// inherit read/write methods from Stream.
BitStream.EOF = Stream.EOF;
BitStream.prototype = Object.create(Stream.prototype);
// bit chunk read/write
BitStream.prototype.readBits = function(n) {
    var i, r = 0, b;
    if (n > 31) {
        r = this.readBits(n-16)*0x10000; // fp multiply, not shift
        return r + this.readBits(16);
    }
    for (i = 0; i < n; i++) {
        r <<= 1; // this could make a negative value if n>31
        // bits read past EOF are all zeros!
        if (this.readBit() > 0) { r++; }
    }
    return r;
};
BitStream.prototype.writeBits = function(n, value) {
    if (n > 32) {
        var low = (value & 0xFFFF);
        var high = (value - low) / (0x10000); // fp division, not shift
        this.writeBits(n-16, high);
        this.writeBits(16, low);
        return;
    }
    var i;
    for (i = n-1; i >= 0; i--) {
        this.writeBit( (value >>> i) & 1 );
    }
};



var MAX_HUFCODE_BITS = 20;
var MAX_SYMBOLS = 258;
var SYMBOL_RUNA = 0;
var SYMBOL_RUNB = 1;
var MIN_GROUPS = 2;
var MAX_GROUPS = 6;
var GROUP_SIZE = 50;

var WHOLEPI = 0x314159265359; // 48-bit integer
var SQRTPI =  0x177245385090; // 48-bit integer

var EOF = Stream.EOF;

var mtf = function(array, index) {
  var src = array[index], i;
  for (i = index; i > 0; i--) {
    array[i] = array[i-1];
  }
  array[0] = src;
  return src;
};

var Err = {
  OK: 0,
  LAST_BLOCK: -1,
  NOT_BZIP_DATA: -2,
  UNEXPECTED_INPUT_EOF: -3,
  UNEXPECTED_OUTPUT_EOF: -4,
  DATA_ERROR: -5,
  OUT_OF_MEMORY: -6,
  OBSOLETE_INPUT: -7,
  END_OF_BLOCK: -8
};
var ErrorMessages = {};
ErrorMessages[Err.LAST_BLOCK] =            "Bad file checksum";
ErrorMessages[Err.NOT_BZIP_DATA] =         "Not bzip data";
ErrorMessages[Err.UNEXPECTED_INPUT_EOF] =  "Unexpected input EOF";
ErrorMessages[Err.UNEXPECTED_OUTPUT_EOF] = "Unexpected output EOF";
ErrorMessages[Err.DATA_ERROR] =            "Data error";
ErrorMessages[Err.OUT_OF_MEMORY] =         "Out of memory";
ErrorMessages[Err.OBSOLETE_INPUT] = "Obsolete (pre 0.9.5) bzip format not supported.";

var _throw = function(status, optDetail) {
  var msg = ErrorMessages[status] || 'unknown error';
  if (optDetail) { msg += ': '+optDetail; }
  var e = new TypeError(msg);
  e.errorCode = status;
  throw e;
};

var Bunzip = function(inputStream, outputStream) {
  this.writePos = this.writeCurrent = this.writeCount = 0;

  this._start_bunzip(inputStream, outputStream);
};
Bunzip.prototype._init_block = function() {
  var moreBlocks = this._get_next_block();
  if ( !moreBlocks ) {
    this.writeCount = -1;
    return false; /* no more blocks */
  }
  this.blockCRC = new CRC32();
  return true;
};
/* XXX micro-bunzip uses (inputStream, inputBuffer, len) as arguments */
Bunzip.prototype._start_bunzip = function(inputStream, outputStream) {
  /* Ensure that file starts with "BZh['1'-'9']." */
  var buf = Util.makeU8Buffer(4);
  if (inputStream.read(buf, 0, 4) !== 4 ||
      String.fromCharCode(buf[0], buf[1], buf[2]) !== 'BZh')
    _throw(Err.NOT_BZIP_DATA, 'bad magic');

  var level = buf[3] - 0x30;
  if (level < 1 || level > 9)
    _throw(Err.NOT_BZIP_DATA, 'level out of range');

  this.reader = new BitStream(inputStream);

  /* Fourth byte (ascii '1'-'9'), indicates block size in units of 100k of
     uncompressed data.  Allocate intermediate buffer for block. */
  this.dbufSize = 100000 * level;
  this.nextoutput = 0;
  this.outputStream = outputStream;
  this.streamCRC = 0;
};
Bunzip.prototype._get_next_block = function() {
  var i, j, k;
  var reader = this.reader;
  // this is get_next_block() function from micro-bunzip:
  /* Read in header signature and CRC, then validate signature.
     (last block signature means CRC is for whole file, return now) */
  var h = reader.readBits(48);
  if (h === SQRTPI) { // last block
    return false; /* no more blocks */
  }
  if (h !== WHOLEPI)
    _throw(Err.NOT_BZIP_DATA);
  this.targetBlockCRC = reader.readBits(32);
  this.streamCRC = (this.targetBlockCRC ^
                    ((this.streamCRC << 1) | (this.streamCRC>>>31))) >>> 0;
  /* We can add support for blockRandomised if anybody complains.  There was
     some code for this in busybox 1.0.0-pre3, but nobody ever noticed that
     it didn't actually work. */
  if (reader.readBits(1))
    _throw(Err.OBSOLETE_INPUT);
  var origPointer = reader.readBits(24);
  if (origPointer > this.dbufSize)
    _throw(Err.DATA_ERROR, 'initial position out of bounds');
  /* mapping table: if some byte values are never used (encoding things
     like ASCII text), the compression code removes the gaps to have fewer
     symbols to deal with, and writes a sparse bitfield indicating which
     values were present.  We make a translation table to convert the symbols
     back to the corresponding bytes. */
  var t = reader.readBits(16);
  var symToByte = Util.makeU8Buffer(256), symTotal = 0;
  for (i = 0; i < 16; i++) {
    if (t & (1 << (0xF - i))) {
      var o = i * 16;
      k = reader.readBits(16);
      for (j = 0; j < 16; j++)
        if (k & (1 << (0xF - j)))
          symToByte[symTotal++] = o + j;
    }
  }

  /* How many different Huffman coding groups does this block use? */
  var groupCount = reader.readBits(3);
  if (groupCount < MIN_GROUPS || groupCount > MAX_GROUPS)
    _throw(Err.DATA_ERROR);
  /* nSelectors: Every GROUP_SIZE many symbols we select a new Huffman coding
     group.  Read in the group selector list, which is stored as MTF encoded
     bit runs.  (MTF=Move To Front, as each value is used it's moved to the
     start of the list.) */
  var nSelectors = reader.readBits(15);
  if (nSelectors === 0)
    _throw(Err.DATA_ERROR);

  var mtfSymbol = Util.makeU8Buffer(256);
  for (i = 0; i < groupCount; i++)
    mtfSymbol[i] = i;

  var selectors = Util.makeU8Buffer(nSelectors); // was 32768...

  for (i = 0; i < nSelectors; i++) {
    /* Get next value */
    for (j = 0; reader.readBits(1); j++)
      if (j >= groupCount) _throw(Err.DATA_ERROR);
    /* Decode MTF to get the next selector */
    selectors[i] = mtf(mtfSymbol, j);
  }

  /* Read the Huffman coding tables for each group, which code for symTotal
     literal symbols, plus two run symbols (RUNA, RUNB) */
  var symCount = symTotal + 2;
  var groups = [], hufGroup;
  for (j = 0; j < groupCount; j++) {
    var length = Util.makeU8Buffer(symCount), temp = Util.makeU16Buffer(MAX_HUFCODE_BITS + 1);
    /* Read Huffman code lengths for each symbol.  They're stored in
       a way similar to MTF; record a starting value for the first symbol,
       and an offset from the previous value for every symbol after that. */
    t = reader.readBits(5); // lengths
    for (i = 0; i < symCount; i++) {
      for (;;) {
        if (t < 1 || t > MAX_HUFCODE_BITS) _throw(Err.DATA_ERROR);
        /* If first bit is 0, stop.  Else second bit indicates whether
           to increment or decrement the value. */
        if(!reader.readBits(1))
          break;
        if(!reader.readBits(1))
          t++;
        else
          t--;
      }
      length[i] = t;
    }

    /* Find largest and smallest lengths in this group */
    var minLen,  maxLen;
    minLen = maxLen = length[0];
    for (i = 1; i < symCount; i++) {
      if (length[i] > maxLen)
        maxLen = length[i];
      else if (length[i] < minLen)
        minLen = length[i];
    }

    /* Calculate permute[], base[], and limit[] tables from length[].
     *
     * permute[] is the lookup table for converting Huffman coded symbols
     * into decoded symbols.  base[] is the amount to subtract from the
     * value of a Huffman symbol of a given length when using permute[].
     *
     * limit[] indicates the largest numerical value a symbol with a given
     * number of bits can have.  This is how the Huffman codes can vary in
     * length: each code with a value>limit[length] needs another bit.
     */
    hufGroup = {};
    groups.push(hufGroup);
    hufGroup.permute = Util.makeU16Buffer(MAX_SYMBOLS);
    hufGroup.limit = Util.makeU32Buffer(MAX_HUFCODE_BITS + 2);
    hufGroup.base = Util.makeU32Buffer(MAX_HUFCODE_BITS + 1);
    hufGroup.minLen = minLen;
    hufGroup.maxLen = maxLen;
    /* Calculate permute[].  Concurrently, initialize temp[] and limit[]. */
    var pp = 0;
    for (i = minLen; i <= maxLen; i++) {
      temp[i] = hufGroup.limit[i] = 0;
      for (t = 0; t < symCount; t++)
        if (length[t] === i)
          hufGroup.permute[pp++] = t;
    }
    /* Count symbols coded for at each bit length */
    for (i = 0; i < symCount; i++)
      temp[length[i]]++;
    /* Calculate limit[] (the largest symbol-coding value at each bit
     * length, which is (previous limit<<1)+symbols at this level), and
     * base[] (number of symbols to ignore at each bit length, which is
     * limit minus the cumulative count of symbols coded for already). */
    pp = t = 0;
    for (i = minLen; i < maxLen; i++) {
      pp += temp[i];
      /* We read the largest possible symbol size and then unget bits
         after determining how many we need, and those extra bits could
         be set to anything.  (They're noise from future symbols.)  At
         each level we're really only interested in the first few bits,
         so here we set all the trailing to-be-ignored bits to 1 so they
         don't affect the value>limit[length] comparison. */
      hufGroup.limit[i] = pp - 1;
      pp <<= 1;
      t += temp[i];
      hufGroup.base[i + 1] = pp - t;
    }
    hufGroup.limit[maxLen + 1] = Number.MAX_VALUE; /* Sentinel value for reading next sym. */
    hufGroup.limit[maxLen] = pp + temp[maxLen] - 1;
    hufGroup.base[minLen] = 0;
  }
  /* We've finished reading and digesting the block header.  Now read this
     block's Huffman coded symbols from the file and undo the Huffman coding
     and run length encoding, saving the result into dbuf[dbufCount++]=uc */

  /* Initialize symbol occurrence counters and symbol Move To Front table */
  var byteCount = Util.makeU32Buffer(256);
  for (i = 0; i < 256; i++)
    mtfSymbol[i] = i;
  /* Loop through compressed symbols. */
  var runPos = 0, dbufCount = 0, selector = 0, uc;
  var dbuf = this.dbuf = Util.makeU32Buffer(this.dbufSize);
  symCount = 0;
  for (;;) {
    /* Determine which Huffman coding group to use. */
    if (!(symCount--)) {
      symCount = GROUP_SIZE - 1;
      if (selector >= nSelectors) { _throw(Err.DATA_ERROR); }
      hufGroup = groups[selectors[selector++]];
    }
    /* Read next Huffman-coded symbol. */
    i = hufGroup.minLen;
    j = reader.readBits(i);
    for (;;i++) {
      if (i > hufGroup.maxLen) { _throw(Err.DATA_ERROR); }
      if (j <= hufGroup.limit[i])
        break;
      j = (j << 1) | reader.readBits(1);
    }
    /* Huffman decode value to get nextSym (with bounds checking) */
    j -= hufGroup.base[i];
    if (j < 0 || j >= MAX_SYMBOLS) { _throw(Err.DATA_ERROR); }
    var nextSym = hufGroup.permute[j];
    /* We have now decoded the symbol, which indicates either a new literal
       byte, or a repeated run of the most recent literal byte.  First,
       check if nextSym indicates a repeated run, and if so loop collecting
       how many times to repeat the last literal. */
    if (nextSym === SYMBOL_RUNA || nextSym === SYMBOL_RUNB) {
      /* If this is the start of a new run, zero out counter */
      if (!runPos){
        runPos = 1;
        t = 0;
      }
      /* Neat trick that saves 1 symbol: instead of or-ing 0 or 1 at
         each bit position, add 1 or 2 instead.  For example,
         1011 is 1<<0 + 1<<1 + 2<<2.  1010 is 2<<0 + 2<<1 + 1<<2.
         You can make any bit pattern that way using 1 less symbol than
         the basic or 0/1 method (except all bits 0, which would use no
         symbols, but a run of length 0 doesn't mean anything in this
         context).  Thus space is saved. */
      if (nextSym === SYMBOL_RUNA)
        t += runPos;
      else
        t += 2 * runPos;
      runPos <<= 1;
      continue;
    }
    /* When we hit the first non-run symbol after a run, we now know
       how many times to repeat the last literal, so append that many
       copies to our buffer of decoded symbols (dbuf) now.  (The last
       literal used is the one at the head of the mtfSymbol array.) */
    if (runPos){
      runPos = 0;
      if (dbufCount + t > this.dbufSize) { _throw(Err.DATA_ERROR); }
      uc = symToByte[mtfSymbol[0]];
      byteCount[uc] += t;
      while (t--)
        dbuf[dbufCount++] = uc;
    }
    /* Is this the terminating symbol? */
    if (nextSym > symTotal)
      break;
    /* At this point, nextSym indicates a new literal character.  Subtract
       one to get the position in the MTF array at which this literal is
       currently to be found.  (Note that the result can't be -1 or 0,
       because 0 and 1 are RUNA and RUNB.  But another instance of the
       first symbol in the MTF array, position 0, would have been handled
       as part of a run above.  Therefore 1 unused MTF position minus
       2 non-literal nextSym values equals -1.) */
    if (dbufCount >= this.dbufSize) { _throw(Err.DATA_ERROR); }
    i = nextSym - 1;
    uc = mtf(mtfSymbol, i);
    uc = symToByte[uc];
    /* We have our literal byte.  Save it into dbuf. */
    byteCount[uc]++;
    dbuf[dbufCount++] = uc;
  }
  /* At this point, we've read all the Huffman-coded symbols (and repeated
     runs) for this block from the input stream, and decoded them into the
     intermediate buffer.  There are dbufCount many decoded bytes in dbuf[].
     Now undo the Burrows-Wheeler transform on dbuf.
     See http://dogma.net/markn/articles/bwt/bwt.htm
  */
  if (origPointer < 0 || origPointer >= dbufCount) { _throw(Err.DATA_ERROR); }
  /* Turn byteCount into cumulative occurrence counts of 0 to n-1. */
  j = 0;
  for (i = 0; i < 256; i++) {
    k = j + byteCount[i];
    byteCount[i] = j;
    j = k;
  }
  /* Figure out what order dbuf would be in if we sorted it. */
  for (i = 0; i < dbufCount; i++) {
    uc = dbuf[i] & 0xff;
    dbuf[byteCount[uc]] |= (i << 8);
    byteCount[uc]++;
  }
  /* Decode first byte by hand to initialize "previous" byte.  Note that it
     doesn't get output, and if the first three characters are identical
     it doesn't qualify as a run (hence writeRunCountdown=5). */
  var pos = 0, current = 0, run = 0;
  if (dbufCount) {
    pos = dbuf[origPointer];
    current = (pos & 0xff);
    pos >>= 8;
    run = -1;
  }
  this.writePos = pos;
  this.writeCurrent = current;
  this.writeCount = dbufCount;
  this.writeRun = run;

  return true; /* more blocks to come */
};
/* Undo burrows-wheeler transform on intermediate buffer to produce output.
   If start_bunzip was initialized with out_fd=-1, then up to len bytes of
   data are written to outbuf.  Return value is number of bytes written or
   error (all errors are negative numbers).  If out_fd!=-1, outbuf and len
   are ignored, data is written to out_fd and return is RETVAL_OK or error.
*/
Bunzip.prototype._read_bunzip = function(outputBuffer, len) {
    var copies, previous, outbyte;
    /* james@jamestaylor.org: writeCount goes to -1 when the buffer is fully
       decoded, which results in this returning RETVAL_LAST_BLOCK, also
       equal to -1... Confusing, I'm returning 0 here to indicate no
       bytes written into the buffer */
  if (this.writeCount < 0) { return 0; }

  var gotcount = 0;
  var dbuf = this.dbuf, pos = this.writePos, current = this.writeCurrent;
  var dbufCount = this.writeCount, outputsize = this.outputsize;
  var run = this.writeRun;

  while (dbufCount) {
    dbufCount--;
    previous = current;
    pos = dbuf[pos];
    current = pos & 0xff;
    pos >>= 8;
    if (run++ === 3){
      copies = current;
      outbyte = previous;
      current = -1;
    } else {
      copies = 1;
      outbyte = current;
    }
    this.blockCRC.updateCRCRun(outbyte, copies);
    while (copies--) {
      this.outputStream.writeByte(outbyte);
      this.nextoutput++;
    }
    if (current != previous)
      run = 0;
  }
  this.writeCount = dbufCount;
  // check CRC
  if (this.blockCRC.getCRC() !== this.targetBlockCRC) {
    _throw(Err.DATA_ERROR, "Bad block CRC "+
           "(got "+this.blockCRC.getCRC().toString(16)+
           " expected "+this.targetBlockCRC.toString(16)+")");
  }
  return this.nextoutput;
};

/* Static helper functions */
Bunzip.Err = Err;
// 'input' can be a stream or a buffer
// 'output' can be a stream or a buffer or a number (buffer size)
Bunzip.decode = function(input, output, multistream) {
  // make a stream from a buffer, if necessary
  var inputStream = Util.coerceInputStream(input);
  var o = Util.coerceOutputStream(output, output);
  var outputStream = o.stream;

  var bz = new Bunzip(inputStream, outputStream);
  while (true) {
    if ('eof' in inputStream && inputStream.eof()) break;
    if (bz._init_block()) {
      bz._read_bunzip();
    } else {
      var targetStreamCRC = bz.reader.readBits(32);
      if (targetStreamCRC !== bz.streamCRC) {
        _throw(Err.DATA_ERROR, "Bad stream CRC "+
               "(got "+bz.streamCRC.toString(16)+
               " expected "+targetStreamCRC.toString(16)+")");
      }
      if (multistream &&
          'eof' in inputStream &&
          !inputStream.eof()) {
        // note that start_bunzip will also resync the bit reader to next byte
        bz._start_bunzip(inputStream, outputStream);
      } else break;
    }
  }
  return o.retval;
};
Bunzip.decodeBlock = function(input, pos, output) {
  // make a stream from a buffer, if necessary
  var inputStream = Util.coerceInputStream(input);
  var o = Util.coerceOutputStream(output, output);
  var outputStream = o.stream;
  var bz = new Bunzip(inputStream, outputStream);
  bz.reader.seekBit(pos);
  /* Fill the decode buffer for the block */
  var moreBlocks = bz._get_next_block();
  if (moreBlocks) {
    /* Init the CRC for writing */
    bz.blockCRC = new CRC32();

    /* Zero this so the current byte from before the seek is not written */
    bz.writeCopies = 0;

    /* Decompress the block and write to stdout */
    bz._read_bunzip();
    // XXX keep writing?
  }
  return o.retval;
};
/* Reads bzip2 file from stream or buffer `input`, and invoke
 * `callback(position, size)` once for each bzip2 block,
 * where position gives the starting position (in *bits*)
 * and size gives uncompressed size of the block (in *bytes*). */
Bunzip.table = function(input, callback, multistream) {
  // make a stream from a buffer, if necessary
  var inputStream = new Stream();
  inputStream.delegate = Util.coerceInputStream(input);
  inputStream.pos = 0;
  inputStream.readByte = function() {
    this.pos++;
    return this.delegate.readByte();
  };
  inputStream.tell = function() { return this.pos; };
  if (inputStream.delegate.eof) {
    inputStream.eof = inputStream.delegate.eof.bind(inputStream.delegate);
  }
  var outputStream = new Stream();
  outputStream.pos = 0;
  outputStream.writeByte = function() { this.pos++; };

  var bz = new Bunzip(inputStream, outputStream);
  var blockSize = bz.dbufSize;
  while (true) {
    if ('eof' in inputStream && inputStream.eof()) break;

    var position = bz.reader.tellBit();

    if (bz._init_block()) {
      var start = outputStream.pos;
      bz._read_bunzip();
      callback(position, outputStream.pos - start);
    } else {
      var crc = bz.reader.readBits(32); // (but we ignore the crc)
      if (multistream &&
          'eof' in inputStream &&
          !inputStream.eof()) {
        // note that start_bunzip will also resync the bit reader to next byte
        bz._start_bunzip(inputStream, outputStream);
        console.assert(bz.dbufSize === blockSize,
                       "shouldn't change block size within multistream file");
      } else break;
    }
  }
};

// create a Huffman tree from the table of frequencies
var StaticHuffman = function(freq, alphabetSize) {
  // As in BZip2HuffmanStageEncoder.java (from jbzip2):
  // The Huffman allocator needs its input symbol frequencies to be
  // sorted, but we need to return code lengths in the same order as
  // the corresponding frequencies are passed in.
  // The symbol frequency and index are merged into a single array of
  // integers - frequency in the high 23 bits, index in the low 9
  // bits.
  //     2^23 = 8,388,608 which is higher than the maximum possible
  //            frequency for one symbol in a block
  //     2^9 = 512 which is higher than the maximum possible
  //            alphabet size (== 258)
  // Sorting this array simultaneously sorts the frequencies and
  // leaves a lookup that can be used to cheaply invert the sort
  var i, mergedFreq = [];
  for (i=0; i<alphabetSize; i++) {
    mergedFreq[i] = (freq[i] << 9) | i;
  }
  mergedFreq.sort(function(a,b) { return a-b; });
  var sortedFreq = mergedFreq.map(function(v) { return v>>>9; });
  // allocate code lengths in place. (result in sortedFreq array)
  HuffmanAllocator.allocateHuffmanCodeLengths(sortedFreq, MAX_HUFCODE_BITS);
  // reverse the sort to put codes & code lengths in order of input symbols
  this.codeLengths = Util.makeU8Buffer(alphabetSize);
  for (i=0; i<alphabetSize; i++) {
    var sym = mergedFreq[i] & 0x1FF;
    this.codeLengths[sym] = sortedFreq[i];
  }
};
// compute canonical Huffman codes, given code lengths
StaticHuffman.prototype.computeCanonical = function() {
  var alphabetSize = this.codeLengths.length;
  // merge arrays; sort first by length then by symbol.
  var i, merged = [];
  for (i=0; i<alphabetSize; i++) {
    merged[i] = (this.codeLengths[i] << 9) | i;
  }
  merged.sort(function(a,b) { return a-b; });
  // use sorted lengths to assign codes
  this.code = Util.makeU32Buffer(alphabetSize);
  var code = 0, prevLen = 0;
  for (i=0; i<alphabetSize; i++) {
    var curLen = merged[i] >>> 9;
    var sym = merged[i] & 0x1FF;
    console.assert(prevLen <= curLen);
    code <<= (curLen - prevLen);
    this.code[sym] = code++;
    prevLen = curLen;
  }
};
// compute the cost of encoding the given range of symbols w/ this Huffman code
StaticHuffman.prototype.cost = function(array, offset, length) {
  var i, cost = 0;
  for (i=0; i<length; i++) {
    cost += this.codeLengths[array[offset+i]];
  }
  return cost;
};
// emit the bit lengths used by this Huffman code
StaticHuffman.prototype.emit = function(outStream) {
  // write the starting length
  var i, currentLength = this.codeLengths[0];
  outStream.writeBits(5, currentLength);
  for (i=0; i<this.codeLengths.length; i++) {
    var codeLength = this.codeLengths[i];
    var value, delta;
    console.assert(codeLength > 0 && codeLength <= MAX_HUFCODE_BITS);
    if (currentLength < codeLength) {
      value = 2; delta = codeLength - currentLength;
    } else {
      value = 3; delta = currentLength - codeLength;
    }
    while (delta-- > 0) {
      outStream.writeBits(2, value);
    }
    outStream.writeBit(0);
    currentLength = codeLength;
  }
};
// encode the given symbol with this Huffman code
StaticHuffman.prototype.encode = function(outStream, symbol) {
  outStream.writeBits(this.codeLengths[symbol], this.code[symbol]);
};

// read a block for bzip2 compression.
var readBlock = function(inStream, block, length, crc) {
  var pos = 0;
  var lastChar = -1;
  var runLength = 0;
  while (pos < length) {
    if (runLength===4) {
      block[pos++] = 0;
      if (pos >= length) { break; }
    }
    var ch = inStream.readByte();
    if (ch === EOF) {
      break;
    }
    crc.updateCRC(ch);
    if (ch !== lastChar) {
      lastChar = ch;
      runLength = 1;
    } else {
      runLength++;
      if (runLength > 4) {
        if (runLength < 256) {
          block[pos-1]++;
          continue;
        } else {
          runLength = 1;
        }
      }
    }
    block[pos++] = ch;
  }
  return pos;
};

// divide the input into groups at most GROUP_SIZE symbols long.
// assign each group to the Huffman table which compresses it best.
var assignSelectors = function(selectors, groups, input) {
  var i, j, k;
  for (i=0, k=0; i<input.length; i+=GROUP_SIZE) {
    var groupSize = Math.min(GROUP_SIZE, input.length - i);
    var best = 0, bestCost = groups[0].cost(input, i, groupSize);
    for (j=1; j<groups.length; j++) {
      var groupCost = groups[j].cost(input, i, groupSize);
      if (groupCost < bestCost) {
        best = j; bestCost = groupCost;
      }
    }
    selectors[k++] = best;
  }
};
var optimizeHuffmanGroups = function(groups, targetGroups, input,
                                     selectors, alphabetSize) {
  // until we've got "targetGroups" Huffman codes, pick the Huffman code which
  // matches the largest # of groups and split it by picking the groups
  // which require more than the median number of bits to encode.
  // then recompute frequencies and reassign Huffman codes.
  var i, j, k, groupCounts = [];
  while (groups.length < targetGroups) {
    assignSelectors(selectors, groups, input);
    // which code gets used the most?
    for (i=0; i<groups.length; i++) { groupCounts[i] = 0; }
    for (i=0; i<selectors.length; i++) {
      groupCounts[selectors[i]]++;
    }
    var which = groupCounts.indexOf(Math.max.apply(Math, groupCounts));
    // ok, let's look at the size of those blocks
    var splits = [];
    for (i=0, j=0; i<selectors.length; i++) {
      if (selectors[i] !== which) { continue; }
      var start = i*GROUP_SIZE;
      var end = Math.min(start + GROUP_SIZE, input.length);
      splits.push({index: i, cost:groups[which].cost(input, start, end-start)});
    }
    // find the median.  there are O(n) algorithms to do this, but we'll
    // be lazy and use a full O(n ln n) sort.
    splits.sort(function(s1, s2) { return s1.cost - s2.cost; });
    // assign the groups in the top half to the "new" selector
    for (i=(splits.length>>>1); i<splits.length; i++) {
      selectors[splits[i].index] = groups.length;
    }
    groups.push(null);
    // recompute frequencies
    var freq = [], f;
    for (i=0; i<groups.length; i++) {
      f = freq[i] = [];
      for (j=0; j<alphabetSize; j++) { f[j] = 0; }
    }
    for (i=0, j=0; i<input.length; ) {
      f = freq[selectors[j++]];
      for (k=0; k<GROUP_SIZE && i<input.length; k++) {
        f[input[i++]]++;
      }
    }
    // reconstruct Huffman codes
    for (i=0; i<groups.length; i++) {
      groups[i] = new StaticHuffman(freq[i], alphabetSize);
    }
  }
};

var compressBlock = function(block, length, outStream) {
  var c, i, j, k;
  // do BWT transform
  var U = Util.makeU8Buffer(length);
  var pidx = BWT.bwtransform2(block, U, length, 256);
  outStream.writeBit(0); // not randomized
  outStream.writeBits(24, pidx);
  // track values used; write bitmap
  var used = [], compact = [];
  for (i=0; i<length; i++) {
    c = block[i];
    used[c] = true;
    compact[c>>>4] = true;
  }
  for (i=0; i<16; i++) {
    outStream.writeBit(!!compact[i]);
  }
  for (i=0; i<16; i++) {
    if (compact[i]) {
      for (j=0; j<16; j++) {
        outStream.writeBit(!!used[(i<<4)|j]);
      }
    }
  }
  var alphabetSize = 0;
  for (i=0; i<256; i++) {
    if (used[i]) {
      alphabetSize++;
    }
  }
  // now MTF and RLE/2 encoding, while tracking symbol statistics.
  // output can be one longer than length, because we include the
  // end-of-block character at the end. Similarly, we need a U16
  // array because the end-of-block character can be 256.
  var A = Util.makeU16Buffer(length+1);
  var endOfBlock = alphabetSize + 1;
  var freq = [];
  for (i=0; i<=endOfBlock; i++) { freq[i] = 0; }
  var M = Util.makeU8Buffer(alphabetSize);
  for (i=0, j=0; i<256; i++) {
    if (used[i]) { M[j++] = i; }
  }
  used = null; compact = null;
  var pos = 0, runLength = 0;
  var emit = function(c) {
    A[pos++] = c;
    freq[c]++;
  };
  var emitLastRun = function() {
    while (runLength !== 0) {
      if (runLength & 1) {
        emit(0); // RUNA
        runLength -= 1;
      } else {
        emit(1); // RUNB
        runLength -= 2;
      }
      runLength >>>= 1;
    }
  };
  for (i=0; i<U.length; i++) {
    c = U[i];
    // look for C in M
    for (j=0; j<alphabetSize; j++) {
      if (M[j]===c) { break; }
    }
    console.assert(j!==alphabetSize);
    // shift MTF array
    mtf(M, j);
    // emit j
    if (j===0) {
      runLength++;
    } else {
      emitLastRun();
      emit(j+1);
      runLength = 0;
    }
  }
  emitLastRun();
  emit(endOfBlock); // end of block symbol
  A = A.subarray(0, pos);
  // now A[0...pos) has the encoded output, and freq[0-alphabetSize] has the
  // frequencies.  Use these to construct Huffman tables.
  // the canonical bzip2 encoder does some complicated optimization
  // to attempt to select the best tables.  We're going to simplify things:
  // (unless the block is very short) we're always going to create MAX_GROUPS
  // tables; 1 based on global frequencies, and the rest based on dividing the
  // block into MAX_GROUPS-1 pieces.
  var groups = [];
  var targetGroups; // how many Huffman groups should we create?
  // look at length of MTF-encoded block to pick a good number of groups
  if (pos >= 2400) { targetGroups = 6; }
  else if (pos >= 1200) { targetGroups = 5; }
  else if (pos >= 600) { targetGroups = 4; }
  else if (pos >= 200) { targetGroups = 3; }
  else { targetGroups = 2; }
  // start with two Huffman groups: one with the global frequencies, and
  // a second with a flat frequency distribution (which is also the smallest
  // possible Huffman table to encode, which is handy to prevent excessive
  // bloat if the input file size is very small)
  groups.push(new StaticHuffman(freq, endOfBlock+1));
  for (i=0; i<=endOfBlock; i++) { freq[i] = 1; }
  groups.push(new StaticHuffman(freq, endOfBlock+1));
  freq = null;
  // Now optimize the Huffman groups!  this is a black art.
  // we probably don't want to waste too much time on it, though.
  var selectors = Util.makeU8Buffer(Math.ceil(pos / GROUP_SIZE));
  optimizeHuffmanGroups(groups, targetGroups, A, selectors, endOfBlock+1);
  assignSelectors(selectors, groups, A);

  // okay, let's start writing out our Huffman tables
  console.assert(groups.length >= MIN_GROUPS && groups.length <= MAX_GROUPS);
  outStream.writeBits(3, groups.length);
  // and write out the best selector for each group
  outStream.writeBits(15, selectors.length);
  for (i=0; i<groups.length; i++) { M[i] = i; } // initialize MTF table.
  for (i=0; i<selectors.length; i++) {
    var s = selectors[i];
    // find selector in MTF list
    for (j=0; j<groups.length; j++) { if (M[j]===s) { break; } }
    console.assert(j<groups.length);
    mtf(M, j);
    // emit 'j' as a unary number
    for (;j>0; j--) {
      outStream.writeBit(1);
    }
    outStream.writeBit(0);
  }
  // okay, now emit the Huffman tables in order.
  for (i=0; i<groups.length; i++) {
    groups[i].emit(outStream);
    groups[i].computeCanonical(); // get ready for next step while we're at it
  }
  // okay, now (finally!) emit the actual data!
  for (i=0, k=0; i<pos; ) {
    var huff = groups[selectors[k++]];
    for (j=0; j<GROUP_SIZE && i<pos; j++) {
      huff.encode(outStream, A[i++]);
    }
  }
  // done.
};

var Bzip2 = Object.create(null);
Bzip2.compressFile = function(inStream, outStream, props) {
  inStream = Util.coerceInputStream(inStream);
  var o = Util.coerceOutputStream(outStream, outStream);
  outStream = new BitStream(o.stream);

  var blockSizeMultiplier = 9;
  if (typeof(props)==='number') {
    blockSizeMultiplier = props;
  }
  if (blockSizeMultiplier < 1 || blockSizeMultiplier > 9) {
    throw new Error('Invalid block size multiplier');
  }

  var blockSize = blockSizeMultiplier * 100000;
  // the C implementation always writes at least length-19 characters,
  // but it reads ahead enough that if the last character written was part
  // of a run, it writes out the full run.
  // That's really annoying to implement.
  // So instead just subtract 19 from the blockSize; in most cases (unless
  // there's a run at the end of the block) this will yield block divisions
  // matching the C implementation.
  blockSize -= 19;

  // write file magic
  outStream.writeByte('B'.charCodeAt(0));
  outStream.writeByte('Z'.charCodeAt(0));
  outStream.writeByte('h'.charCodeAt(0)); // Huffman-coded bzip
  outStream.writeByte('0'.charCodeAt(0) + blockSizeMultiplier);

  // allocate a buffer for the block
  var block = Util.makeU8Buffer(blockSize);
  var streamCRC = 0;
  var length;

  do {
    var crc = new CRC32();
    length = readBlock(inStream, block, blockSize, crc);
    if (length > 0) {
      streamCRC = (((streamCRC << 1) | (streamCRC>>>31)) ^ crc.getCRC()) >>> 0;
      outStream.writeBits(48, WHOLEPI);
      outStream.writeBits(32, crc.getCRC());
      compressBlock(block, length, outStream);
    }
  } while (length === blockSize);

  // finish up
  outStream.writeBits(48, SQRTPI);
  outStream.writeBits(32, streamCRC);
  outStream.flush(); // get the last bits flushed out
  return o.retval;
};

Bzip2.decompressFile = Bunzip.decode;
Bzip2.decompressBlock = Bunzip.decodeBlock;
Bzip2.table = Bunzip.table;

return Bzip2;
})()

class Int64Base {
  constructor(first, second) {
    // new Int64(Buffer)
    if (first instanceof Buffer) {
      const length = first.length;
      if (length !== 8) {
        throw new Error(`Buffer length must be 8, current argument length is ${length}`);
      }
      this.buffer = first;
      return;
    }
    if (typeof first === 'number') {
      // new Int64(Number)
      if (second === undefined) {
        if (!Number.isSafeInteger(first)) {
          throw new Error(`Unsafe integer`);
        }
        let high = 0,
            low = 0;
        if (first >= 0) {
          high = first / 0x100000000;
          low = first & 0xffffffff;
        } else {
          if (-first <= 0xffffffff) {
            high = 0xffffffff;
            low = first & 0xffffffff;
          } else {
            high = 0xffffffff - (-first / 0x100000000 >>> 0);
            low = 0x100000000 - (-first & 0xffffffff);
          }
        }
        this.buffer = int32PairToBuffer(high, low);
        return;
      }
      // new Int64(Number, Number)
      if (typeof second === 'number') {
        this.buffer = int32PairToBuffer(first, second);
        return;
      }
    }
    throw new Error(`Invalid arguments`);
  }

  typename() {
    const className = this.constructor.name;
    throw new Error(`${className} does not implemented typename()`);
  }

  equal(i) {
    if (this.typename() !== i.typename()) {
      return false;
    }
    return this.buffer.compare(i.toBuffer()) === 0;
  }

  and(i) {
    const lHigh = this.buffer.readUInt32BE();
    const lLow = this.buffer.readUInt32BE(4);
    const ibuf = i.toBuffer();
    const rHigh = ibuf.readUInt32BE();
    const rLow = ibuf.readUInt32BE(4);
    const high = lHigh & rHigh;
    const low = lLow & rLow;
    return new this.constructor(high, low);
  }

  or(i) {
    const lHigh = this.buffer.readUInt32BE();
    const lLow = this.buffer.readUInt32BE(4);
    const ibuf = i.toBuffer();
    const rHigh = ibuf.readUInt32BE();
    const rLow = ibuf.readUInt32BE(4);
    const high = lHigh | rHigh;
    const low = lLow | rLow;
    return new this.constructor(high, low);
  }

  xor(i) {
    const lHigh = this.buffer.readUInt32BE();
    const lLow = this.buffer.readUInt32BE(4);
    const ibuf = i.toBuffer();
    const rHigh = ibuf.readUInt32BE();
    const rLow = ibuf.readUInt32BE(4);
    const high = lHigh ^ rHigh;
    const low = lLow ^ rLow;
    return new this.constructor(high, low);
  }

  toBuffer() {
    return this.buffer;
  }

  shiftLeft(num) {
    if (num >= 64) {
      return Int64.Zero;
    }
    let buf = Buffer.alloc(8);
    let high = this.buffer.readInt32BE();
    let low = this.buffer.readInt32BE(4);
    if (num >= 32) {
      let value = low << num - 32;
      const int32Buf = int32ToBuffer(value);
      for (let i = 0; i < 4; i++) {
        buf[i] = int32Buf[i];
      }
    } else {
      let shifted_high = (high << num & 0xffffffff) + ((low & shiftMaskHigh(num)) >>> 32 - num);
      let shifted_low = low << num;
      buf.writeUInt32BE(shifted_high >>> 0, 0);
      buf.writeUInt32BE(shifted_low >>> 0, 4);
    }
    return new this.constructor(buf);
  }

  add(i) {
    const lHigh = this.buffer.readUInt32BE();
    const lLow = this.buffer.readUInt32BE(4);
    const ibuf = i.toBuffer();
    const rHigh = ibuf.readUInt32BE();
    const rLow = ibuf.readUInt32BE(4);

    let high = lHigh + rHigh;
    let low = lLow + rLow;
    if (low >= 0x100000000) {
      low &= 0xffffffff;
      high += 1;
    }
    high &= 0xffffffff;
    const buf = int32PairToBuffer(high, low);
    return new this.constructor(buf);
  }

  sub(i) {
    return this.add(i.twosComplement());
  }

  mul(i) {
    const ibuf = i.toBuffer();
    const high = ibuf.readUInt32BE();
    const low = ibuf.readUInt32BE(4);

    let num = this.constructor.Zero;
    for (let i = 0; i < 32; i++) {
      if (low & 0x1 << i) {
        num = num.add(this.shiftLeft(i));
      }
    }
    for (let i = 0; i < 32; i++) {
      if (high & 0x1 << i) {
        num = num.add(this.shiftLeft(i + 32));
      }
    }
    return num;
  }

  div(i) {
    const divMod = this.divAndMod(i);
    return divMod.div;
  }

  mod(i) {
    const divMod = this.divAndMod(i);
    return divMod.mod;
  }

  twosComplement() {
    return this.xor(UInt64.Max).add(new UInt64(0, 1));
  }

  topBitPosition() {
    let high = this.buffer.readUInt32BE();
    let low = this.buffer.readUInt32BE(4);
    if (high > 0) {
      let pos = 32;
      while (pos > 1) {
        if (high & 1 << pos - 1) {
          break;
        }
        pos--;
      }
      if (pos != 0) {
        return pos + 32;
      }
    }
    if (low > 0) {
      let pos = 32;
      while (pos > 1) {
        if (low & 1 << pos - 1) {
          break;
        }
        pos--;
      }
      if (pos != 0) {
        return pos;
      }
    }
    return 0;
  }
}

export class Int64 extends Int64Base {
  constructor(first, second) {
    super(first, second);
  }

  typename() {
    return 'Int64';
  }

  shiftRight(num, logical) {
    let buf = Buffer.alloc(8);
    let high = this.buffer.readInt32BE();
    let low = this.buffer.readInt32BE(4);
    num %= 64;
    if (num >= 32) {
      let value;
      if (logical) {
        value = high >>> num - 32;
      } else {
        value = high >> num - 32;
      }
      const int32Buf = int32ToBuffer(value);
      for (let i = 0; i < 4; i++) {
        buf[4 + i] = int32Buf[i];
      }
      if (!logical && (high & 0x80000000) !== 0) {
        for (let i = 0; i < 4; i++) {
          buf[i] = 0xff;
        }
      }
    } else {
      let shifted_high;
      if (logical) {
        shifted_high = high >>> num;
      } else {
        shifted_high = high >> num;
      }
      let shifted_low = ((high & shiftMaskLow(num)) << 32 - num) + (low >>> num);
      buf = int32PairToBuffer(shifted_high, shifted_low);
    }
    return new Int64(buf);
  }

  compare(i) {
    if (i instanceof UInt64) {
      return this.toUnsigned().compare(i);
    }
    let high = this.buffer.readInt32BE();
    let low = this.buffer.readUInt32BE(4);
    let iHigh = i.toBuffer().readInt32BE();
    let iLow = i.toBuffer().readUInt32BE(4);
    if (high === iHigh) {
      if (low === iLow) {
        return 0;
      }
      if (low > iLow) {
        return 1;
      }
      return -1;
    }
    if (high > iHigh) {
      return 1;
    }
    return -1;
  }

  divAndMod(i) {
    if (i instanceof Int64) {
      const compare = this.compare(i);
      if (compare === 0) {
        return {
          div: new this.constructor(0x1),
          mod: new this.constructor(0x0)
        };
      }
      if (!(this.isNegative() || i.isNegative())) {
        const divAndMod = uint64PositiveDivAndMod(this, i);
        return {
          div: divAndMod.div.toSigned(),
          mod: divAndMod.mod.toSigned()
        };
      }
      if (this.isNegative() && i.isNegative()) {
        const divAndMod = uint64PositiveDivAndMod(this.twosComplement(), i.twosComplement());
        return {
          div: divAndMod.div.toSigned(),
          mod: divAndMod.mod.toSigned().toNegative()
        };
      }
      if (i.isNegative()) {
        const divAndMod = uint64PositiveDivAndMod(this, i.twosComplement());
        return {
          div: divAndMod.div.toSigned().twosComplement(),
          mod: divAndMod.mod.toSigned()
        };
      }
      const divAndMod = uint64PositiveDivAndMod(this.twosComplement(), i);
      return {
        div: divAndMod.div.toSigned().twosComplement(),
        mod: divAndMod.mod.toSigned().twosComplement()
      };
    }
    return uint64PositiveDivAndMod(this, i);
  }

  toString(radix, prefix) {
    if (radix === undefined) {
      radix = 10;
    }
    let pre = '';
    if (prefix === true) {
      pre = prefixString(radix);
    }
    let str = '';
    let high = this.buffer.readUInt32BE();
    let low = this.buffer.readUInt32BE(4);
    let negative = (high & 0x80000000) !== 0;
    if (negative) {
      high = ~high;
      // low = 2 ** 32 - low  // over v8
      low = Math.pow(2, 32) - low; // for node v6
    }
    while (true) {
      const low_and_high_mod = high % radix * 2 ** 32 + low;
      if (high == -1) break;
      high = Math.floor(high / radix);
      low = Math.floor(low_and_high_mod / radix);
      str = (low_and_high_mod % radix).toString(radix) + str;
      if (!high && !low) {
        break;
      }
    }
    str = pre + str;
    if (negative) {
      str = '-' + str;
    }
    return str;
  }

  /**
   * Int64 only method
   */
  toUnsigned() {
    return new UInt64(this.toBuffer());
  }

  toNegative() {
    return this.xor(UInt64.Max).add(new Int64(0x0, 0x1));
  }

  isNegative() {
    const high = this.buffer.readUInt32BE();
    return (high & 0x80000000) !== 0;
  }
}
Int64.Zero = new Int64(0, 0);
Int64.Max = new Int64(0x7fffffff, 0xffffffff);
Int64.Min = new Int64(0x80000000, 0);

export class UInt64 extends Int64Base {
  typename() {
    return 'UInt64';
  }

  shiftRight(num) {
    let buf = Buffer.alloc(8);
    let high = this.buffer.readUInt32BE();
    let low = this.buffer.readUInt32BE(4);
    num %= 64;
    if (num >= 32) {
      let value = high >>> num - 32;
      const int32Buf = int32ToBuffer(value);
      for (let i = 0; i < 4; i++) {
        buf[4 + i] = int32Buf[i];
      }
    } else {
      let shifted_high = high >>> num;
      let shifted_low = ((high & shiftMaskLow(num)) << 32 - num) + (low >>> num);
      buf = int32PairToBuffer(shifted_high, shifted_low);
    }
    return new Int64(buf);
  }

  compare(i) {
    let high = this.buffer.readUInt32BE();
    let low = this.buffer.readUInt32BE(4);
    let iHigh = i.toBuffer().readUInt32BE();
    let iLow = i.toBuffer().readUInt32BE(4);
    if (high === iHigh) {
      if (low === iLow) {
        return 0;
      }
      if (low > iLow) {
        return 1;
      }
      return -1;
    }
    if (high > iHigh) {
      return 1;
    }
    return -1;
  }

  divAndMod(i) {
    return uint64PositiveDivAndMod(this, i);
  }

  div(i) {
    return this.divAndMod(i).div;
  }

  toString(radix, prefix) {
    if (radix === undefined) {
      radix = 10;
    }
    let pre = '';
    if (prefix === true) {
      pre = prefixString(radix);
    }
    let high = this.buffer.readUInt32BE();
    let low = this.buffer.readUInt32BE(4);
    let str = '';
    while (true) {
      const low_and_high_mod = high % radix * 2 ** 32 + low;
      if (high == -1) break;
      high = Math.floor(high / radix);
      low = Math.floor(low_and_high_mod / radix);
      str = (low_and_high_mod % radix).toString(radix) + str;
      if (!high && !low) {
        break;
      }
    }
    return pre + str;
  }

  toSigned() {
    return new Int64(this.toBuffer());
  }
}

function prefixString(radix) {
  switch (radix) {
    case 2:
      return '0b';
    case 8:
      return '0o';
    case 10:
      return '';
    case 16:
      return '0x';
    default:
      throw new Error(`cannot add prefix with this radix ${radix}`);
  }
}
UInt64.Zero = new UInt64(0, 0);
UInt64.Min = UInt64.Zero;
UInt64.Max = new UInt64(0xffffffff, 0xffffffff);

function int32PairToBuffer(high, low) {
  let buf = Buffer.alloc(8);
  buf.writeUInt32BE(high >>> 0, 0);
  buf.writeUInt32BE(low >>> 0, 4);
  return buf;
}

function int32ToBuffer(num) {
  let buf = Buffer.alloc(4);
  for (let i = 0; i < 4; i++) {
    buf[3 - i] = num & 0xff;
    num >>= 8;
  }
  return buf;
}

function shiftMaskHigh(num) {
  if (num === 0) return 0;
  const shift = 32 - num;
  return 2 ** 32 - 1 >>> shift << shift;
}

function shiftMaskLow(num) {
  if (num === 0) return 0;
  const shift = 32 - num;
  return 2 ** 32 - 1 >>> shift;
}

function checkType(l, r) {
  const lType = l.constructor.name;
  const rType = r.constructor.name;
  if (lType !== rType) {
    throw new Error(`Cannot add ${lType} to ${rType}`);
  }
}

function uint64PositiveDivAndMod(dividend, divisor) {
  if (dividend instanceof Int64) {
    dividend = dividend.toUnsigned();
  }
  if (divisor instanceof Int64) {
    divisor = divisor.toUnsigned();
  }
  const compare = dividend.compare(divisor);
  if (compare === 0) {
    return {
      div: new UInt64(0x1),
      mod: UInt64.Zero
    };
  }
  if (compare === 1) {
    let div = UInt64.Zero;
    let current = dividend;
    const divisorTopBitPos = divisor.topBitPosition();
    while (true) {
      let topBitPos = current.topBitPosition();
      let shift = topBitPos - divisorTopBitPos;
      if (shift < 0) {
        break;
      }
      let shiftedi = divisor.shiftLeft(shift);
      if (current.compare(shiftedi) === 0) {
        div = div.add(new UInt64(1).shiftLeft(shift));
        current = UInt64.Zero;
        break;
      } else if (current.compare(shiftedi) === 1) {
        div = div.add(new UInt64(1).shiftLeft(shift));
        current = current.sub(shiftedi);
      } else if (shift > 0) {
        shift--;
        shiftedi = divisor.shiftLeft(shift);
        div = div.add(new UInt64(1).shiftLeft(shift));
        current = current.sub(shiftedi);
      } else {
        break;
      }
    }
    return {
      div: div,
      mod: current
    };
  }
  return {
    div: UInt64.Zero,
    mod: dividend
  };
}



const _ = num => {
    return num instanceof UInt64 ? num : new UInt64(num)
}

const not = num => {
    if (num instanceof UInt64) {
        let buf = Buffer.from(num.toBuffer())
        for (let i = 0, len = buf.length; i < len; ++i) {
        buf[i] = ~buf[i]
        }
        return new UInt64(buf)
    }
    return ~num
}

/**
 * Encryption table for MPQ hash function
 */
const encryptionTable = (() => {
  let seed = new UInt64(0x00100001)
  let table = {}

  for (let i = 0, m = 256; i < m; ++i) {
    let index = i
    for (let j = 0, n = 5; j < n; ++j) {
      seed = seed.mul(_(125)).add(_(3)).mod(_(0x2AAAAB))
      let temp1 = seed.and(_(0xFFFF)).shiftLeft(0x10)

      seed = seed.mul(_(125)).add(_(3)).mod(_(0x2AAAAB))
      let temp2 = seed.and(_(0xFFFF))

      table[index] = temp1.or(temp2)

      index += 0x100
    }
  }

  return table
})()




/**
 * Read the compression type & decompress file data,
 * used by `MPQArchive.prototype.readFile`
 */
const decompress =  (data) => {
  let type = data.readUInt8(0)
  switch (type) {
    case 0:
      // raw data
      return data
    case 2:
      return pako.inflate(data.slice(1))
    case 16:
        return Buffer.from(bzip.decompressFile(data.slice(1)))
    default:
      throw new TypeError(`Unsupported compression type "${type}"`)
  }
}

const hashTypes = {
  TABLE_OFFSET: 0,
  HASH_A: 1,
  HASH_B: 2,
  TABLE: 3
}

const MPQ_FILE_IMPLODE       = 0x00000100
const MPQ_FILE_COMPRESS      = 0x00000200
const MPQ_FILE_ENCRYPTED     = 0x00010000
const MPQ_FILE_FIX_KEY       = 0x00020000
const MPQ_FILE_SINGLE_UNIT   = 0x01000000
const MPQ_FILE_DELETE_MARKER = 0x02000000
const MPQ_FILE_SECTOR_CRC    = 0x04000000
const MPQ_FILE_EXISTS        = 0x80000000

class MPQArchive {

  /**
   * Create a MPQArchive object
   *
   * Skip reading listfile by pass listfile=false argument,
   * and then the `files` attribute will be `undefined`.
   */
  constructor (buffer, filename, listfile = true) {
    this.filename = filename
    try {
      this.file = buffer
      this.header = this.readHeader()
      this.hashTable = this.readTable('hash')
      this.blockTable = this.readTable('block')
      if (listfile) {


        let data = this.readFile('(listfile)')
        if(data.constructor === Uint8Array){
            this.files =  new TextDecoder().decode(data).toString().trim().split(/\s+/)
        }
        else{
            this.files = data.toString().trim().split(/\s+/)
        }
        


        
      } else {
        this.files = []
      }
    } catch (err) {
      console.error(`[mpqjs] ${err.message}`)
      console.error(err)
    }
  }

  /**
   * Read the header of a MPQ archive
   */
  readHeader () {
    let header
    this.readOffset = 0

    let magic = this.file.slice(this.readOffset, 4)
    if (magic == 'MPQ\x1a') {
      header = this._readMPQHeader()
      header.offset = 0
    } else if (magic == 'MPQ\x1b') {
      let userDataHeader = this._readMPQUserDataHeader()
      this.readOffset = userDataHeader.mpqHeaderOffset
      header = this._readMPQHeader()
      header.offset = userDataHeader.mpqHeaderOffset
      header.userDataHeader = userDataHeader
    } else {
      throw new TypeError('Invalid file header.', this.filename)
    }

    return header
  }

  /**
   * Read hash/block table of a MPQ archive
   */
  readTable (type) {
    if (type !== 'hash' && type !== 'block') {
      throw new TypeError(`Invalid table type "${type}"`)
    }

    const tableOffset = this.header[`${type}TableOffset`]
    const tableEntries = this.header[`${type}TableEntries`]
    const key = this._hash(`(${type} table)`, 'TABLE')

    this.readOffset = tableOffset + this.header.offset
    let data = this.file.slice(this.readOffset, this.readOffset + tableEntries * 16)
    this.readOffset += tableEntries * 16
    data = this._decrypt(data, key)

    return Array(tableEntries).fill(0).map((z, i) => {
      return this._unpackEntry(data.slice(i * 16, i * 16 + 16), type)
    })
  }

  /**
   * Get the hash table entry corresponding to a given filename
   */
  getHashTableEntry (filename) {
    let hashA = this._hash(filename, 'HASH_A').toBuffer().readUInt32BE(4)
    let hashB = this._hash(filename, 'HASH_B').toBuffer().readUInt32BE(4)
    return this.hashTable.find(entry =>
      entry.hashA === hashA && entry.hashB === entry.hashB)
  }

  /**
   * Read a file from the MPQ archive
   */
  readFile (filename, forceDecompress = false) {
    let hashEntry = this.getHashTableEntry(filename)
    if (!hashEntry) return Buffer.alloc(0)

    let blockEntry = this.blockTable[hashEntry.blockTableIndex]

    // Read the block
    if (blockEntry.flags & MPQ_FILE_EXISTS) {
      if (blockEntry.archivedSize === 0) return Buffer.alloc(0)

      this.readOffset = blockEntry.offset + this.header.offset
      let fileData = this.file.slice(this.readOffset,
        this.readOffset + blockEntry.archivedSize)
      this.readOffset += blockEntry.archivedSize

      if (blockEntry.flags & MPQ_FILE_ENCRYPTED) {
        // TODO: decrypt file
        throw new Error('Encryption file is not supported yet.')
      }

      if (blockEntry.flags & MPQ_FILE_SINGLE_UNIT) {
        // Single unit files only need to be decompressed,
        // but compression only happens when at least one byte is gained.
        if ((blockEntry.flags & MPQ_FILE_COMPRESS) &&
            (forceDecompress || blockEntry.size > blockEntry.archivedSize)) {
          fileData = decompress(fileData)
        }
      } else {
        // TODO: Test case didn't cover

        // File consists of many sectors.
        // They all need to be decompressed separately and united.
        let sectorSize = 512 << this.header.sectorSizeShift
        let sectors = Math.ceil(blockEntry.size / sectorSize)

        let crc
        if (blockEntry.flags & MPQ_FILE_SECTOR_CRC) {
          crc = true
          ++sectors
        } else {
          crc = false
        }

        let positions = Array(sectors + 1).fill(0).map((_, i) => fileData.readUInt32LE(i * 4))
        let result = []
        let sectorBytesLeft = blockEntry.size
        let len = positions.length - (crc ? 2 : 1)

        for (let i = 0; i < len; ++i) {
          let sector = fileData.slice(positions[i], positions[i + 1])
          if ((blockEntry.flags & MPQ_FILE_COMPRESS) &&
              (forceDecompress || sectorBytesLeft > sector.length)) {
            sector = decompress(sector)
          }
          sectorBytesLeft -= sector.length
          result.push(sector)
        }

        fileData = Buffer.concat(result)
      }

      return fileData
    }

    return Buffer.alloc(0)
  }

  /**
   * Extract all the files inside the MPQ archive in memory
   */
  extract () {
    if (this.files && this.files.length > 0) {
      if (this._extractedFilesObject) return this._extractedFilesObject
      this._extractedFilesObject = this.files.reduce((result, filename) => {
        return Object.assign(result, {
          [filename]: this.readFile(filename)
        })
      }, {})
      return this._extractedFilesObject
    } else {
      throw new Error('Cannot extract file without listfile')
    }
  }





//   /**
//    * Extract all files and write to disk
//    */
//   extractToDisk (index = 1) {
//     const { name } = path.parse(this.filename)
//     let dirname = path.join(process.cwd(), name)
//     if (index > 1) {
//       dirname += _ + index
//     }
//     if (fs.existsSync(dirname)) {
//       return extractToDisk(index + 1)
//     } else {
//       fs.mkdirSync(dirname)
//       let files = this.extract()
//       Object.keys(files).forEach(key =>
//         fs.writeFileSync(path.join(dirname, key), files[key]))
//     }
//   }

  /**
   * Extract given files from the archive to disk
//    */
//   extractFiles (filenames) {
//     filenames.forEach(name =>
//       fs.writeFileSync(path.join(process.cwd(), name), this.readFile(name)))
//   }

  printHeaders () {
    console.log('MPQ archive header')
    console.log('------------------')
    Object.keys(this.header).forEach(key => {
      if (key === 'userDataHeader') return

      let content = this.header[key]

      if (key === 'magic') {
        content = JSON.stringify(content)
                      .replace('\\u00', '\\x')
                      .replace(/"/g, '')
      }

      console.log(`${key.padEnd(30, ' ')} ${content}`)
    })
    console.log('')
  }

  printHashTable () {
    console.log('MPQ archive hash table')
    console.log('----------------------')
    console.log(' Hash A   Hash B  Locl Plat BlockIdx')
    this.hashTable.forEach(({
      hashA, hashB, locale, platform, blockTableIndex
    }) => {
      console.log(
        hashA.toString(16).toUpperCase().padStart(8, 0) + ' ' +
        hashB.toString(16).toUpperCase().padStart(8, 0) + ' ' +
        locale.toString(16).toUpperCase().padStart(4, 0) + ' ' +
        platform.toString(16).toUpperCase().padStart(4, 0) + ' ' +
        blockTableIndex.toString(16).toUpperCase().padStart(8, 0)
      )
    })
    console.log('')
  }

  printBlockTable () {
    console.log('MPQ archive block table')
    console.log('-----------------------')
    console.log(' Offset  ArchSize RealSize  Flags')
    this.blockTable.forEach(({ offset, archivedSize, size, flags }) => {
      console.log(
        offset.toString(16).toUpperCase().padStart(8, 0) + ' ' +
        archivedSize.toString().padStart(8, ' ') + ' ' +
        size.toString().padStart(8, ' ') + ' ' +
        flags.toString(16).toUpperCase().padStart(8, 0)
      )
    })
    console.log('')
  }

  printFiles () {
    if (this.files) {
      console.log('Files')
      console.log('-----')
      let width = Math.max.apply(null, this.files.map(f => f.length))
      this.files.forEach(filename => {
        let hashEntry = this.getHashTableEntry(filename)
        let blockEntry = this.blockTable[hashEntry.blockTableIndex]
        console.log(
          filename.padEnd(width, ' ') + ' ' +
          blockEntry.size.toString().padStart(8, ' ') + ' bytes'
        )
      })
      console.log('')
    }
  }

  /**
   * Unpack entry data from buffer, used by `readTable`
   */
  _unpackEntry (data, type) {
    switch (type) {
      case 'hash':
        return {
          hashA: data.readUInt32LE(0),
          hashB: data.readUInt32LE(4),
          locale: data.readUInt16LE(8),
          platform: data.readUInt16LE(10),
          blockTableIndex: data.readUInt32LE(12)
        }
        break
      case 'block':
        return {
          offset: data.readUInt32LE(0),
          archivedSize: data.readUInt32LE(4),
          size: data.readUInt32LE(8),
          flags: data.readUInt32LE(12)
        }
        break
      default:
        throw new TypeError(`Invalid table type "${type}"`)
    }
  }

  /**
   * Read the MPQ header, used by `readHeader()`
   */
  _readMPQHeader () {
    let header = {
      magic: this.file.slice(this.readOffset, this.readOffset + 4).toString(),
      headerSize: this.file.readUInt32LE(this.readOffset + 4),
      archivedSize: this.file.readUInt32LE(this.readOffset + 8),
      formatVersion: this.file.readUInt16LE(this.readOffset + 12),
      sectorSizeShift: this.file.readUInt16LE(this.readOffset + 14),
      hashTableOffset: this.file.readUInt32LE(this.readOffset + 16),
      blockTableOffset: this.file.readUInt32LE(this.readOffset + 20),
      hashTableEntries: this.file.readUInt32LE(this.readOffset + 24),
      blockTableEntries: this.file.readUInt32LE(this.readOffset + 28)
    }
    this.readOffset += 32
    if (header.formatVersion === 1) {
      // TODO: test case didn't cover
      Object.assign(header, {
        extendedBlockTableOffset: _(this.file.slice(this.readOffset, this.readOffset + 8)),
        hashTableOffsetHigh: this.file.readInt16LE(this.readOffset + 8),
        blockTableOffsetHigh: this.file.readInt16LE(this.readOffset + 10)
      })
      this.readOffset += 12
    }
    return header
  }

  /**
   * Read the MPQ user data header, used by `readHeader()`
   */
  _readMPQUserDataHeader () {
    let header = {
      magic: this.file.slice(this.readOffset, 4).toString(),
      userDataSize: this.file.readUInt32LE(this.readOffset + 4),
      mpqHeaderOffset: this.file.readUInt32LE(this.readOffset + 8),
      userDataHeaderSize: this.file.readUInt32LE(this.readOffset + 12)
    }
    this.readOffset += 16
    header.content = this.file.slice(this.readOffset, this.readOffset + header.userDataHeaderSize)
    return header
  }

  /**
   * Hash a string using MPQ's hash function
   */
  _hash (string, type) {
    let seed1 = _(0x7FED7FED)
    let seed2 = _(0xEEEEEEEE)

    string = string.toUpperCase()
    for (let i = 0, len = string.length; i < len; ++i) {
      let ch = string.charCodeAt(i)
      let value = encryptionTable[(hashTypes[type] << 8) + ch]
      seed1 = value.xor(seed1.add(seed2)).and(_(0xFFFFFFFF))
      seed2 = _(ch).add(seed1).add(seed2).add(seed2.shiftLeft(5)).add(_(3)).and(_(0xFFFFFFFF))
    }

    return seed1
  }

  /**
   * Decrypt hash, block table or a sector
   */
  _decrypt (data, key) {
    let seed1 = _(key)
    let seed2 = _(0xEEEEEEEE)

    let length = data.length
    let result = Buffer.alloc(length)

    for (let i = 0, len = Math.floor(length / 4); i < len; ++i) {
      seed2 = seed2.add(
        encryptionTable[seed1.and(_(0xFF)).add(_(0x400)).toString(10)]
      )
      seed2 = seed2.and(_(0xFFFFFFFF))
      let value = _(data.slice(i * 4, i * 4 + 4).readUInt32LE())
      value = value.xor(seed1.add(seed2)).and(_(0xFFFFFFFF))

      seed1 = not(seed1).shiftLeft(0x15).add(_(0x11111111))
                        .or(seed1.shiftRight(0x0B))
      seed1 = seed1.and(_(0xFFFFFFFF))
      seed2 = value.add(seed2).add(seed2.shiftLeft(5))
                   .add(_(3)).and(_(0xFFFFFFFF))

      result.writeUInt32LE(value.toBuffer().readUInt32BE(4), i * 4)
    }

    return result
  }
}

export default MPQArchive

// import fs from 'fs'
// import path from 'path'

// const mpq = new MPQArchive(path.resolve("./parser/-temp/ARC.SC2Mod"))
// let files = mpq.files 
// // let data = mpq.extract ()
// // for(let i in data){
// //     data[i] = data[i].toString()
// // }
// let data2 = mpq.readFile(mpq.files[1])
// const text = data2.toString(); // Default is 'utf8'
// text