import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";
import MailIcon from "@material-ui/icons/Mail";
import DeleteIcon from "@material-ui/icons/Delete";
import Label from "@material-ui/icons/Label";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import InfoIcon from "@material-ui/icons/Info";
import ForumIcon from "@material-ui/icons/Forum";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { v4 as uuidv4 } from "uuid";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
      marginRight: 1,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 18,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

function StyledTreeItem(props) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    rootInfo,
    ser,
    step,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          key={uuidv4()}
          sx={{
            display: "flex",
            alignItems: "left",
            p: 0.5,
            pr: 1,
            paddingRight: 1,
            //borderLeft: "1px solid rgba(224, 224, 224, 1)",
          }}
        >
          {labelInfo ? (
            <Typography
              variant="caption"
              color="inherit"
              style={{
                marginRight: 5,
                paddingRight: 5,
                color: "#3B83BD",
                text: "bold",
                fontSize: 12,
                borderRight: "1px solid rgba(224, 224, 224, 1)",
              }}
              //sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
            >
              {labelInfo}
            </Typography>
          ) : (
            ""
          )}
          <div>
            <typography>{rootInfo}</typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "inherit",
                flexGrow: 1,
                alignItems: "left",
                textAlign: "left",
                paddingRight: 5,
              }}
            >
              {labelText.split("\n").map((str) => (
                <div key={uuidv4()}>{str}</div>
              ))}
            </Typography>
          </div>
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

export default function GmailTreeView(props) {
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? props.expandedArrIB : []
    );
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length === 0 ? props.expandedArrIB : []
    );
  };

  const renderTree = (nodes) => (
    <StyledTreeItem
      nodeId={`${nodes.id}`}
      labelText={nodes.name ? nodes.name : ""}
      labelIcon={MoreVertIcon}
      labelInfo={nodes.num ? nodes.num : null}
      rootInfo={nodes.rootTitle ? nodes.rootTitle : ""}
      color="#1a73e8"
      bgColor="#e8f0fe"
      ser={nodes.searched ? nodes.searched : ""}
      step={props.stepIB ? props.stepIB : 1}
      key={uuidv4()}
      sx={{ mx: -1, textAlign: "left", text: "bold" }}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </StyledTreeItem>
  );

  const trees = props.data.map((value, index) => {
    return <div key={uuidv4()}>{renderTree(value)}</div>;
  });
  return (
    <div>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleExpandClick}>
          {expanded.length === 0 ? "Expand all" : "Collapse all"}
        </Button>
        <Button onClick={handleSelectClick}>
          {selected.length === 0 ? "Select all" : "Unselect all"}
        </Button>
      </Box>
      <TreeView
        //expanded={expanded}
        defaultExpanded={expanded}
        aria-label="gmail"
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 50 }} />}
        key={uuidv4()}
        //expanded={expanded}
        //selected={selected}
        //onNodeToggle={handleToggle}
      >
        {trees}
      </TreeView>
    </div>
  );
}
