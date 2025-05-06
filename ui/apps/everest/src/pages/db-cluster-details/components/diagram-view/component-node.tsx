import { NodeProps } from '@xyflow/react';
import { CustomNode } from './types';
import { DBClusterComponent } from 'shared-types/components.types';
import { Chip, Stack, Tooltip, Typography } from '@mui/material';
import { COMPONENT_NODE_HEIGHT, COMPONENT_NODE_WIDTH } from './constants';
import ComponentStatus from '../component-status';
import { componentStatusToBaseStatus } from '../components.constants';
import DiagramComponentAge from './diagram-component-age';
import DiagramNode from './diagram-node';

const ComponentNode = ({
  data: {
    selected,
    componentData: { name, status, ready, type, restarts, started = '' },
  },
}: NodeProps<CustomNode<DBClusterComponent>>) => {
  return (
    <DiagramNode
      height={COMPONENT_NODE_HEIGHT}
      width={COMPONENT_NODE_WIDTH}
      elevation={selected ? 4 : 0}
      dataTestId={`component-node-${name}${selected ? '-selected' : ''}`}
      showBottomHandle
      paperProps={{
        sx: {
          cursor: 'pointer',
        },
      }}
    >
      <Stack direction={'row'} alignItems={'center'}>
        <ComponentStatus
          status={status}
          statusMap={componentStatusToBaseStatus(ready)}
        />
        <Typography ml={'auto'} variant="body1">
          {ready} Ready
        </Typography>
      </Stack>
      <Stack mt={2}>
        <Tooltip title={name} placement="right" arrow>
          <Typography
            variant="body1"
            data-testid="component-name"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </Typography>
        </Tooltip>
        <DiagramComponentAge
          date={started}
          restarts={restarts}
          typographyProps={{
            variant: 'body2',
          }}
        />
      </Stack>
      <Chip
        label={type}
        sx={{ alignSelf: 'flex-start', mt: 'auto' }}
        data-testid="component-type"
      />
    </DiagramNode>
  );
};

export default ComponentNode;
