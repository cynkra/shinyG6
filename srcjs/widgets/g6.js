import 'widgets';
import {
  CanvasEvent,
  ComboEvent,
  EdgeEvent,
  Graph,
  NodeEvent,
  ExtensionCategory,
  register,
  GraphEvent
} from '@antv/g6';
import { setClickEvents, setGraphEvents } from '../modules/events';
import { registerShinyHandlers } from '../modules/handlers';
import { AntLine, FlyMarkerCubic, CircleComboWithExtraButton } from '../modules/extensions';

// Ant lines
register(ExtensionCategory.EDGE, 'ant-line', AntLine);
// Animated lines
register(ExtensionCategory.EDGE, 'fly-marker-cubic', FlyMarkerCubic);
// Circle combo
register(ExtensionCategory.COMBO, 'circle-combo-with-extra-button', CircleComboWithExtraButton);

HTMLWidgets.widget({

  name: 'g6',

  type: 'output',

  factory: function (el, width, height) {

    // TODO: define shared variables for this instance
    let graph;

    return {

      renderValue: function (x, id = el.id) {

        // TODO: code to render the widget, e.g.
        let config = x;
        // Don't change the container
        config.container = el.id;
        graph = new Graph(config);

        //graph.on(GraphEvent.AFTER_ELEMENT_CREATE, (e) => {
        //  console.log(e);
        //});

        if (HTMLWidgets.shinyMode) {

          const clickEvents = [
            NodeEvent.CLICK,
            EdgeEvent.CLICK,
            ComboEvent.CLICK
          ]
          setClickEvents(clickEvents, graph, el);

          // Is this enough? :)
          const graphEvents = [
            GraphEvent.AFTER_ELEMENT_CREATE,
            GraphEvent.AFTER_ELEMENT_DESTROY,
            GraphEvent.AFTER_DRAW,
            GraphEvent.AFTER_LAYOUT,
            GraphEvent.AFTER_ANIMATE,
            GraphEvent.AFTER_RENDER
          ]
          setGraphEvents(graphEvents, graph, el);

          // When click on canvas and target isn't node or edge or combo
          // we have to reset the Shiny selected-node or edge or combo
          graph.on(CanvasEvent.CLICK, (e) => {
            Shiny.setInputValue(el.id + '-selected_node', null);
            Shiny.setInputValue(el.id + '-selected_edge', null);
            Shiny.setInputValue(el.id + '-selected_combo', null);
          });

          registerShinyHandlers(graph, el);
        }

        graph.render();

        window.addEventListener('resize', () => {
          this.resize();
        })

      },
      getWidget: function () {
        return graph
      },
      resize: function (width, height) {
        // TODO: code to re-render the widget with a new size
        graph.resize();

      }

    };
  }
});
