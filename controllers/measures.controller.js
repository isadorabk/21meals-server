'use strict';

class MeasuresController {
  constructor (measureModel) {
    if (!measureModel) throw new Error('Measure model not provided');
    this.Measure = measureModel;
    this.getMeasures = this.getMeasures.bind(this);
  }

  async getMeasures (ctx, next) {
    // Check if the method is correct
    if (ctx.method !== 'GET') throw new Error('Method not allowed');

    // Find all measures
    const measures = await this.Measure.findAll({
      attributes: ['id', 'name', 'short'],
    });
    if (measures) {
      ctx.body = measures.map(el => el.dataValues);
    } else {
      // Send an empty array if there's no measure
      ctx.body = [];
    }
    ctx.status = 200;
  }

}

module.exports = MeasuresController;