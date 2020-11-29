import { format } from 'date-fns'

export interface NumericField {
    type: 'N'
    /** max 11 bytes */
    name: string
    /** max 254 (0xfe) */
    length: number
    /** how many numbers to record after the decimal point */
    decimalLength: number
}

export interface CharField {
    type: 'C'
    /** max 11 bytes */
    name: string
    /** max 254 (0xfe) */
    length: number
}

export type Field = NumericField | CharField

/**
 * Writes DBase V (DOS, Level 5) format .DBF
 * Spec: https://en.wikipedia.org/wiki/.dbf#File_format_of_Level_5_DOS_dBASE
 *
 * @param fields
 * @param rows
 */
export function dbfWrite(fields: Field[], rows: Array<any[]>) {
    const date = new Date()
    /// DBF file header is 32B
    const headerSize = 32
    /// Field descriptors are 32B each + 1B to mark end of field descriptor array
    const fieldDescriptorsSize = fields.length * 32 + 1
    /// Record size is num_rows * (field_length + 1B_deletion_flag)
    const recordSize = fields.map((field) => field.length).reduce((p, c) => p + c, 0) + 1
    const recordsSize = rows.length * recordSize
    /// Total file size is file header length + descriptor length + records length + 1B terminator
    const fileSize = headerSize + fieldDescriptorsSize + recordsSize + 1
    const buf = new ArrayBuffer(fileSize)
    const data = new DataView(buf)
    /// DBF Header
    data.setUint8(0, 0x3) // Format dBase V
    data.setUint8(1, Number(format(date, 'yy'))) // YY
    data.setUint8(2, Number(format(date, 'MM'))) // MM
    data.setUint8(3, Number(format(date, 'dd'))) // dd
    data.setUint32(4, rows.length, true)
    data.setUint16(8, headerSize + fieldDescriptorsSize, true) // num bytes in header
    data.setUint16(10, recordSize, true) // num bytes in a record
    data.setUint16(12, 0, true) // reserved
    data.setUint8(14, 0) // incomplete transaction flag
    data.setUint8(15, 0) // encryption flag
    data.setUint32(16, 0, true) // reserved for DOS 16..27
    data.setUint32(16 + 4, 0, true)
    data.setUint32(16 + 4 + 4, 0, true) // ends at byte 27 inclusive
    data.setUint8(28, 0) // production mdx file flag
    data.setUint8(29, 0x0) // language driver ID
    data.setUint16(30, 0x01e1, true) // reserved
    /// Field descriptors
    let f = 0
    for (let i = 32; f < fields.length; i += 32, f += 1) {
        const field = fields[f]
        for (let j = 0; j < 11; j++) {
            data.setUint8(i + j, field.name.charCodeAt(j))
        }
        data.setUint8(i + 11, field.type.charCodeAt(0)) // field type
        data.setUint32(i + 12, 0, true) // reserved
        data.setUint8(i + 16, Math.min(0xfe, field.length)) // char length
        data.setUint8(i + 17, field.type === 'N' ? field.decimalLength : 0) // decimal length
        data.setUint16(i + 18, 0, true) // work area ID (???)
        data.setUint8(i + 20, 1) // example (???)
        data.setUint32(i + 21, 0, true) // reserved
        data.setUint32(i + 21 + 4, 0, true) // reserved
        data.setUint16(i + 21 + 4 + 4, 0, true) // reserved
        data.setUint8(i + 31, 0) // has an index in MDX (???)
    }
    // field descriptor terminator
    data.setUint8(31 + fieldDescriptorsSize, 0x0d)
    /// Records
    let r = 0
    for (let i = 32 + fieldDescriptorsSize; r < rows.length; i += recordSize, r += 1) {
        const row = rows[r]
        // "Deletion flag" 0x20 means active, 0x2a means deleted
        data.setUint8(i, 0x20)
        // Map each cell -> field
        let j = 0
        for (let fieldOff = 0; j < fields.length; j += 1) {
            const field = fields[j]
            const cell = row[j]
            if (field.type === 'C') {
                const str = (cell as string).padEnd(field.length, String.fromCharCode(0x20))
                for (let s = 0; s < field.length; s++) {
                    data.setUint8(i + 1 + fieldOff + s, str.charCodeAt(s))
                }
            } else if (field.type === 'N') {
                let num: string
                if (typeof cell === 'number') {
                    num = Number(cell).toFixed(field.decimalLength)
                } else {
                    num = cell
                }
                num = num.padStart(field.length, String.fromCharCode(0x20))

                for (let s = 0; s < field.length; s++) {
                    data.setUint8(i + 1 + fieldOff + s, num.charCodeAt(s))
                }
            }

            fieldOff += field.length
        }
    }
    // EOF
    data.setUint8(fileSize - 1, 0x1a)
    return buf
}
