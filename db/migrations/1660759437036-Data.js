module.exports = class Data1660759437036 {
  name = 'Data1660759437036'

  async up(db) {
    await db.query(`ALTER TABLE "metadata" ALTER COLUMN "external_url" DROP NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "metadata" ALTER COLUMN "external_url" SET NOT NULL`)
  }
}
