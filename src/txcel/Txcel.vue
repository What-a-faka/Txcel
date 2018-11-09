<template>
  <div class="txcel_wrap">
    <el-table
      ref="tableOrigin"
      v-bind="options"
      :data="data"
      class="el_table_ow"
      border
      @sort-change="handleSortChange"
      @selection-change="handleRowSelect">

      <el-table-column
        v-if="rowSelection"
        type="selection"
        align="center">
      </el-table-column>

      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
        :sortable="col.sortable"
        :resizable="false"
        :width="col.width"
        :header-align="col.headerAlign || 'center'"
        :align="col.align || 'center'"
        :min-width="col.minWidth"
      >
        <template slot-scope="scope">
          <component v-if="col.component" :is="col.component" :row="scope.row"></component>
          <slot v-else-if="col.slot" :name="col.slot" :row="scope.row"></slot>
          <span v-else>{{displayCellData(scope, col)}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="pager"
      class="f_tar f_mt24"
      background
      :layout="pager.layout"
      :current-page="pager.page"
      :page-size="pager.page_size"
      :total="pager.total"
      @current-change="handlePageChange">
    </el-pagination>
  </div>
</template>

<script>
import {
	Table,
	Pagination,
} from 'element-ui'

export default {
  name: 'Txcel',
  
  /* eslint-disable */
  components: {
    [Table.name]: Table,
    [Pagination.name]: Pagination,
  },

  provide() {
    return {
      emitCell: this.emitCell,
    }
  },

  props: {
    data: {
      type: Array,
      default: () => ([]),
    },
    columns: {
      type: [Array, Boolean],
      default: false,
    },
    rowSelection: {
      type: [Object, Boolean],
      default: false,
    },
    pager: {
      type: [Object, Boolean],
      default: () => ({
        layout: 'total,prev,pager,next,jumper',
        page: 1,
        page_size: 10,
        total: 0,
      }),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    getTable() {
      return this.$refs.tableOrigin
    },

    handlePageChange(nextPage) {
      this.$emit(
        'change',
        { ...this.pager, page: nextPage }, // pagination
        null, // ordering
      )
    },

    handleSortChange(sortInfo) {
      this.$emit(
        'change',
        null, // pagination
        sortInfo, // ordering
      )
    },

    handleRowSelect(nextSelected) {
      this.rowSelection.onChange(nextSelected)
    },

    emitCell(prop, data = {}) {
      this.$emit('cellChange', prop, data)
    },

    displayCellData(scope, col) {
      const value = scope.row[col.raw.prop]
      if (!col.formatter) return value
      return col.formatter(value, scope.row)
    },
  },
}
</script>
