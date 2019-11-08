<template>
  <div class="txcel_wrap">
    <el-table
      ref="tableOrigin"
      v-bind="options"
      :data="data"
      class="el_table_ow"
      border
      @sort-change="handleSortChange"
      @selection-change="handleRowSelect"
    >
      <el-table-column
        v-if="rowSelection"
        type="selection"
        align="center"
      ></el-table-column>

      <template v-for="col in columns">
        <el-table-column
          v-if="col.component"
          :key="col.prop"
          :label="col.label"
          :prop="col.prop"
          :sortable="col.sortable"
          :formatter="col.formatter"
          :resizable="false"
          :width="col.width"
          :header-align="col.headerAlign || 'center'"
          :align="col.align || 'center'"
          :min-width="col.minWidth"
        >
          <template slot-scope="scope">
            <component
              :is="genColComponent(col, scope)"
              :row="scope.row"
              :column="col"
            ></component>
          </template>
        </el-table-column>

        <slot v-else-if="col.slot" :name="col.slot"></slot>

        <el-table-column
          v-else
          :key="col.prop"
          :label="col.label"
          :prop="col.prop"
          :sortable="col.sortable"
          :formatter="col.formatter"
          :resizable="false"
          :width="col.width"
          :min-width="col.minWidth"
          :header-align="col.headerAlign || 'center'"
          :align="col.align || 'center'"
        ></el-table-column>
      </template>
    </el-table>

    <el-pagination
      v-if="pager"
      class="f_tar f_mt24"
      background
      :layout="pager.layout"
      :current-page="pager.page"
      :page-size="pager.page_size"
      :total="pager.total"
      @current-change="handlePageChange"
    ></el-pagination>
  </div>
</template>

<script>
import { Table, Pagination, TableColumn } from 'element-ui'

export default {
  name: 'Txcel',

  /* eslint-disable */
  components: {
    [Table.name]: Table,
    [Pagination.name]: Pagination,
    [TableColumn.name]: TableColumn,
  },

  provide() {
    return {
      emitCell: this.emitCell,
    }
  },

  props: {
    data: {
      type: Array,
      default: () => [],
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
        null // ordering
      )
    },

    handleSortChange(sortInfo) {
      this.$emit(
        'change',
        null, // pagination
        sortInfo // ordering
      )
    },

    handleRowSelect(nextSelected) {
      this.rowSelection.onChange(nextSelected)
    },

    emitCell(prop, data = {}) {
      this.$emit('cellChange', prop, data)
    },

    genColComponent(col, scope) {
      const render = col.render
      const component = col.component
      // 兼容老的component写法
      if (
        component &&
        Object.prototype.toString(component) === '[object Object]'
      ) {
        return component
      }

      // render的写法，更简洁
      if (render && typeof render === 'function') {
        return {
          inject: ['emitCell'], // 可以使用emitCell抛出事件
          render: (h) => render(h, scope),
        }
      }
    },
  },
}
</script>
